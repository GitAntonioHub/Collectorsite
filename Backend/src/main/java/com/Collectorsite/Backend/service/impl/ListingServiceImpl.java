package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.dto.CreateListingDTO;
import com.Collectorsite.Backend.dto.ListingDTO;
import com.Collectorsite.Backend.entity.CollectorItem;
import com.Collectorsite.Backend.entity.Listing;
import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.enums.ListingStatus;
import com.Collectorsite.Backend.enums.ListingType;
import com.Collectorsite.Backend.repository.CollectorItemRepository;
import com.Collectorsite.Backend.repository.ListingRepository;
import com.Collectorsite.Backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;

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
        return ListingDTO.builder()
                .id(l.getId())
                .itemId(l.getItem().getId())
                .listingType(l.getListingType())
                .price(l.getPrice())
                .currency(l.getCurrency())
                .status(l.getStatus())
                .startDate(l.getStartDate())
                .endDate(l.getEndDate())
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
    public ListingDTO close(UUID listingId, UUID sellerId) {
        Listing l = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!l.getItem().getOwner().getId().equals(sellerId))
            throw new RuntimeException("Not your listing");

        if (l.getStatus() != ListingStatus.ACTIVE)
            throw new RuntimeException("Already closed");

        l.setStatus(ListingStatus.CLOSED);
        l.setEndDate(Instant.now());
        l.getItem().setStatus(ItemStatus.DRAFT);

        return toDto(l);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListingDTO> listActive() {
        return listingRepo
                .findByStatus(ListingStatus.ACTIVE, Pageable.unpaged())
                .stream()
                .map(ListingServiceImpl::toDto)
                .toList();
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
    public Page<ListingDTO> feed(ListingStatus status, String search, Pageable pageable) {

        // Normalise params
        ListingStatus st = status == null ? ListingStatus.ACTIVE : status;
        String query      = (search == null ? "" : search).trim();

        Page<Listing> page = query.isBlank()
                ? listingRepo.findByStatus(st, pageable)
                : listingRepo.findByStatusAndItem_TitleContainingIgnoreCaseOrStatusAndItem_DescriptionContainingIgnoreCase(
                st, query,
                st, query,
                pageable);

        return page.map(ListingServiceImpl::toDto);
    }

}
