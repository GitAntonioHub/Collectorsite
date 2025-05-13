package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.service.ListingService;
import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
@Transactional
public class ListingServiceImpl implements ListingService {

    private final ListingRepository listingRepo;
    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;

    private ListingDTO map(Listing l) {
        return ListingDTO.builder()
                .id(l.getId())
                .itemId(l.getItem().getId())
                .listingType(l.getListingType())
                .price(l.getPrice())
                .currency(l.getCurrency())
                .startDate(l.getStartDate())
                .endDate(l.getEndDate())
                .status(l.getStatus())
                .build();
    }

    @Override
    public ListingDTO create(CreateListingDTO dto, UUID sellerId) {

        CollectorItem item = itemRepo.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getId().equals(sellerId))
            throw new RuntimeException("You do not own this item");

        if (listingRepo.existsByItem_IdAndStatus(item.getId(), ListingStatus.ACTIVE))
            throw new RuntimeException("Item already listed");

        AppUser seller = userRepo.findById(sellerId).orElseThrow();

        Instant end = dto.getDurationDays() != null
                ? Instant.now().plusSeconds(dto.getDurationDays() * 86_400)
                : null;

        Listing listing = Listing.builder()
                .item(item)
                .seller(seller)
                .listingType(dto.getListingType() == null ? ListingType.SALE : dto.getListingType())
                .price(dto.getPrice() == null ? BigDecimal.ZERO : dto.getPrice())
                .currency(dto.getCurrency() == null ? "USD" : dto.getCurrency())
                .endDate(end)
                .build();

        // mark item as LISTED
        item.setStatus(ItemStatus.LISTED);

        listingRepo.save(listing);
        return map(listing);
    }

    @Override
    public ListingDTO close(UUID listingId, UUID sellerId) {
        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (!listing.getSeller().getId().equals(sellerId))
            throw new RuntimeException("Not your listing");

        listing.setStatus(ListingStatus.CLOSED);
        listing.getItem().setStatus(ItemStatus.SOLD);   // or keep LISTED for trades

        return map(listing);
    }

    @Override
    public List<ListingDTO> listActive() {
        return listingRepo.findByStatus(ListingStatus.ACTIVE)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }

    @Override
    public ListingDTO get(UUID id) {
        return listingRepo.findById(id).map(this::map)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
    }
}
