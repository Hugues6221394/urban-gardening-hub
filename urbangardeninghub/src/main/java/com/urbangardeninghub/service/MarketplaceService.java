package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Marketplace;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.MarketplaceRepository;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceService {
    private final MarketplaceRepository marketplaceRepository;
    private final UserRepository userRepository;

    public Marketplace createListing(Marketplace listing, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        listing.setSeller(seller);
        listing.setStatus(Marketplace.ListingStatus.ACTIVE);
        listing.setCreatedAt(LocalDateTime.now());
        listing.setUpdatedAt(LocalDateTime.now());

        // Calculate total price if not provided
        if (listing.getTotalPrice() == null && listing.getPricePerUnit() != null && listing.getQuantity() != null) {
            listing.setTotalPrice(listing.getPricePerUnit().multiply(
                    java.math.BigDecimal.valueOf(listing.getQuantity())));
        }

        return marketplaceRepository.save(listing);
    }

    public Marketplace updateListing(Long listingId, Marketplace listingDetails, Long userId) {
        Marketplace listing = marketplaceRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check if user owns the listing or is admin
        if (!listing.getSeller().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to update this listing");
        }

        listing.setTitle(listingDetails.getTitle());
        listing.setDescription(listingDetails.getDescription());
        listing.setQuantity(listingDetails.getQuantity());
        listing.setUnit(listingDetails.getUnit());
        listing.setPricePerUnit(listingDetails.getPricePerUnit());
        listing.setIsOrganic(listingDetails.getIsOrganic());
        listing.setIsLocallyGrown(listingDetails.getIsLocallyGrown());
        listing.setAvailableFrom(listingDetails.getAvailableFrom());
        listing.setAvailableUntil(listingDetails.getAvailableUntil());
        listing.setUpdatedAt(LocalDateTime.now());

        // Recalculate total price
        if (listing.getPricePerUnit() != null && listing.getQuantity() != null) {
            listing.setTotalPrice(listing.getPricePerUnit().multiply(
                    java.math.BigDecimal.valueOf(listing.getQuantity())));
        }

        return marketplaceRepository.save(listing);
    }

    public void deleteListing(Long listingId, Long userId) {
        Marketplace listing = marketplaceRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check if user owns the listing or is admin
        if (!listing.getSeller().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to delete this listing");
        }

        marketplaceRepository.delete(listing);
    }

    public Marketplace updateListingStatus(Long listingId, Marketplace.ListingStatus status, Long userId) {
        Marketplace listing = marketplaceRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        // Check if user owns the listing or is admin
        if (!listing.getSeller().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to update this listing");
        }

        listing.setStatus(status);
        listing.setUpdatedAt(LocalDateTime.now());
        return marketplaceRepository.save(listing);
    }

    public Page<Marketplace> getListingsByFilters(String searchTerm, Boolean isOrganic,
                                                  Boolean isLocallyGrown, Pageable pageable) {
        if (searchTerm != null && !searchTerm.isEmpty()) {
            return marketplaceRepository.findBySearchTermAndFilters(searchTerm, isOrganic, isLocallyGrown, pageable);
        }
        return marketplaceRepository.findByFilters(isOrganic, isLocallyGrown, pageable);
    }

    public List<Marketplace> getFeaturedListings() {
        return marketplaceRepository.findFeaturedListings();
    }
}