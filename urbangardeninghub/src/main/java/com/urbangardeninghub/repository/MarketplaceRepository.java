package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.Marketplace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

//    @Query("SELECT m FROM Marketplace m WHERE m.seller.id = :sellerId ORDER BY m.createdAt DESC")
//    List<Marketplace> findBySellerId(@Param("sellerId") Long sellerId);

    List<Marketplace> findBySellerId(Long sellerId);
    Page<Marketplace> findByStatus(Marketplace.ListingStatus status, Pageable pageable);

    @Query("SELECT m FROM Marketplace m WHERE " +
            "(:isOrganic IS NULL OR m.isOrganic = :isOrganic) AND " +
            "(:isLocallyGrown IS NULL OR m.isLocallyGrown = :isLocallyGrown) AND " +
            "m.status = 'ACTIVE'")
    Page<Marketplace> findByFilters(@Param("isOrganic") Boolean isOrganic,
                                    @Param("isLocallyGrown") Boolean isLocallyGrown,
                                    Pageable pageable);

    @Query("SELECT m FROM Marketplace m WHERE " +
            "(LOWER(m.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(m.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
            "(:isOrganic IS NULL OR m.isOrganic = :isOrganic) AND " +
            "(:isLocallyGrown IS NULL OR m.isLocallyGrown = :isLocallyGrown) AND " +
            "m.status = 'ACTIVE'")
    Page<Marketplace> findBySearchTermAndFilters(@Param("searchTerm") String searchTerm,
                                                 @Param("isOrganic") Boolean isOrganic,
                                                 @Param("isLocallyGrown") Boolean isLocallyGrown,
                                                 Pageable pageable);

    @Query("SELECT m FROM Marketplace m WHERE m.status = 'ACTIVE' ORDER BY m.createdAt DESC LIMIT 6")
    List<Marketplace> findFeaturedListings();
}