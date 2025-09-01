package com.urbangardeninghub.controller;

import com.urbangardeninghub.entity.Marketplace;
import com.urbangardeninghub.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {
    private final MarketplaceRepository marketplaceRepository;

    @PostMapping
    public ResponseEntity<Marketplace> createListing(@RequestBody Marketplace listing) {
        Marketplace created = marketplaceRepository.save(listing);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Marketplace>> getActiveListings() {
        List<Marketplace> listings = marketplaceRepository.findByStatus(Marketplace.ListingStatus.ACTIVE);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/organic")
    public ResponseEntity<List<Marketplace>> getOrganicListings() {
        List<Marketplace> listings = marketplaceRepository.findByStatusAndIsOrganicTrue(Marketplace.ListingStatus.ACTIVE);
        return ResponseEntity.ok(listings);
    }
}