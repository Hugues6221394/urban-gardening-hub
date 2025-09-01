package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.Marketplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceRepository extends JpaRepository<Marketplace, Long> {
    List<Marketplace> findByStatus(Marketplace.ListingStatus status);
    List<Marketplace> findByStatusAndIsOrganicTrue(Marketplace.ListingStatus status);

    long countBySellerIdAndStatus(Long sellerId, Marketplace.ListingStatus status);
    List<Marketplace> findTop5BySellerIdOrderByCreatedAtDesc(Long sellerId);

    @Query("SELECT m FROM Marketplace m WHERE m.seller.id = :sellerId ORDER BY m.createdAt DESC")
    List<Marketplace> findBySellerId(@Param("sellerId") Long sellerId);
}