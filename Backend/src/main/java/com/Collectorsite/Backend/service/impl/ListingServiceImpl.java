package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.entity.CollectorItem;
import com.Collectorsite.Backend.entity.Listing;
import com.Collectorsite.Backend.entity.ItemImage;
import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.enums.ListingStatus;
import com.Collectorsite.Backend.enums.ListingType;
import com.Collectorsite.Backend.repository.CollectorItemRepository;
import com.Collectorsite.Backend.repository.ListingRepository;
import com.Collectorsite.Backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Simple implementation – feel free to replace with MapStruct + richer mapping later.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepo;
    private final CollectorItemRepository itemRepo;

    /* ---------- helpers ---------- */

    private static ListingDTO toDto(Listing l) {
        CollectorItem item = l.getItem();
        String imageUrl = item.getImages().stream()
                .filter(ItemImage::getIsPrimary)
                .findFirst()
                .map(ItemImage::getUrl)
                .orElse(null);

        return ListingDTO.builder()
                .id(l.getId())
                .itemId(item.getId())
                .listingType(l.getListingType())
                .price(l.getPrice())
                .currency(l.getCurrency())
                .status(l.getStatus())
                .startDate(l.getStartDate())
                .endDate(l.getEndDate())
                // Item details
                .title(item.getTitle())
                .description(item.getDescription())
                .imageUrl(imageUrl)
                .condition(item.getCondition())
                .year(item.getYear())
                .estimatedValue(item.getEstimatedValue())
                .owner(OwnerDTO.builder()
                    .id(item.getOwner().getId())
                    .displayName(item.getOwner().getDisplayName())
                    .build())
                .build();
    }

    /* ---------- API ---------- */

    @Override
    public ListingDTO create(CreateListingDTO dto, UUID sellerId) {
        CollectorItem item = itemRepo.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getId().equals(sellerId))
            throw new RuntimeException("Not your item");

        if (item.getStatus() != ItemStatus.LISTED && item.getStatus() != ItemStatus.DRAFT)
            throw new RuntimeException("Item cannot be listed now");

        Listing listing = new Listing();
        listing.setId(UUID.randomUUID());
        listing.setItem(item);
        listing.setListingType(dto.getListingType() == null ? ListingType.SALE : dto.getListingType());
        listing.setPrice(dto.getPrice());
        listing.setCurrency(dto.getCurrency());
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setStartDate(Instant.now());

        listingRepo.save(listing);
        item.setStatus(ItemStatus.LISTED);

        return toDto(listing);
    }

    @Override
    public ListingDTO update(UUID id, UpdateListingDTO dto, UUID sellerId) {
        Listing listing = listingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getItem().getOwner().getId().equals(sellerId))
            throw new RuntimeException("Not your listing");

        if (listing.getStatus() != ListingStatus.ACTIVE)
            throw new RuntimeException("Cannot update a closed or sold listing");

        if (dto.getTitle() != null) listing.getItem().setTitle(dto.getTitle());
        if (dto.getDescription() != null) listing.getItem().setDescription(dto.getDescription());
        if (dto.getPrice() != null) listing.setPrice(dto.getPrice());
        if (dto.getCurrency() != null) listing.setCurrency(dto.getCurrency());
        if (dto.getListingType() != null) listing.setListingType(dto.getListingType());

        return toDto(listing);
    }

    @Override
    public ListingDTO close(UUID listingId, UUID sellerId) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getItem().getOwner().getId().equals(sellerId))
            throw new RuntimeException("Not your listing");

        if (listing.getStatus() != ListingStatus.ACTIVE)
            throw new RuntimeException("Already closed");

        listing.setStatus(ListingStatus.CLOSED);
        listing.setEndDate(Instant.now());
        listing.getItem().setStatus(ItemStatus.DRAFT);

        return toDto(listing);
    }

    @Override
    @Transactional(readOnly = true)
    public ListingDTO get(UUID id) {
        return listingRepo.findById(id)
                .map(ListingServiceImpl::toDto)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListingDTO> getActiveListings(String search, Pageable pageable) {
        String query = (search == null ? "" : search).trim();

        Page<Listing> page = query.isBlank()
                ? listingRepo.findByStatusNotIn(
                    List.of(ListingStatus.SOLD, ListingStatus.TRADED),
                    pageable)
                : listingRepo.findByStatusNotInAndItem_TitleContainingIgnoreCaseOrStatusNotInAndItem_DescriptionContainingIgnoreCase(
                    List.of(ListingStatus.SOLD, ListingStatus.TRADED), query,
                    List.of(ListingStatus.SOLD, ListingStatus.TRADED), query,
                    pageable);

        return page.map(ListingServiceImpl::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListingDTO> feed(ListingStatus status, String keyword, Pageable pageable) {
        String query = (keyword == null ? "" : keyword).trim();
        
        Page<Listing> page = query.isBlank()
                ? listingRepo.findByStatus(status, pageable)
                : listingRepo.findByStatusAndItem_TitleContainingIgnoreCaseOrStatusAndItem_DescriptionContainingIgnoreCase(
                    status, query,
                    status, query,
                    pageable);

        return page.map(ListingServiceImpl::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListingDTO> listActive() {
        return listingRepo.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .map(ListingServiceImpl::toDto)
                .toList();
    }
}
