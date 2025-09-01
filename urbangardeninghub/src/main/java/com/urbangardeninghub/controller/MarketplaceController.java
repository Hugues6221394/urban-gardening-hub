package com.urbangardeninghub.controller;

import com.urbangardeninghub.config.UserPrincipal;
import com.urbangardeninghub.entity.Marketplace;
import com.urbangardeninghub.repository.MarketplaceRepository;
import com.urbangardeninghub.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {
    private final MarketplaceRepository marketplaceRepository;
    private final MarketplaceService marketplaceService;

    @GetMapping
    public ResponseEntity<Page<Marketplace>> getListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean organic,
            @RequestParam(required = false) Boolean local) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Marketplace> listings = marketplaceService.getListingsByFilters(search, organic, local, pageable);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Marketplace>> getFeaturedListings() {
        List<Marketplace> listings = marketplaceService.getFeaturedListings();
        return ResponseEntity.ok(listings);
    }

    @PostMapping
    public ResponseEntity<Marketplace> createListing(@RequestBody Marketplace listing, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Marketplace created = marketplaceService.createListing(listing, userPrincipal.getId());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marketplace> updateListing(@PathVariable Long id, @RequestBody Marketplace listing, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Marketplace updated = marketplaceService.updateListing(id, listing, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteListing(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        marketplaceService.deleteListing(id, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Marketplace> updateListingStatus(@PathVariable Long id,
                                                           @RequestParam Marketplace.ListingStatus status,
                                                           Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Marketplace updated = marketplaceService.updateListingStatus(id, status, userPrincipal.getId());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/my-listings")
    public ResponseEntity<List<Marketplace>> getMyListings(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Marketplace> listings = marketplaceRepository.findBySellerId(userPrincipal.getId());
        return ResponseEntity.ok(listings);
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