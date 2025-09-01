package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {
    List<Space> findByStatus(Space.SpaceStatus status);
    List<Space> findBySpaceType(Space.SpaceType spaceType);
    List<Space> findByFarmerId(Long farmerId);

    @Query("SELECT s FROM Space s WHERE s.status = 'AVAILABLE' AND " +
            "s.sunlightHours >= :minSunlight AND s.hasWaterAccess = true")
    List<Space> findOptimalSpaces(@Param("minSunlight") Double minSunlight);

    long countByOwnerId(Long ownerId);
    long countByOwnerIdAndStatus(Long ownerId, Space.SpaceStatus status);
    long countByFarmerId(Long farmerId);
    List<Space> findTop5ByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    @Query("SELECT COALESCE(SUM(s.rentPrice), 0) FROM Space s WHERE s.owner.id = :ownerId AND s.status = :status")
    Double sumRentPriceByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") Space.SpaceStatus status);

    @Query("SELECT s FROM Space s WHERE s.owner.id = :ownerId ORDER BY s.createdAt DESC")
    List<Space> findByOwnerId(@Param("ownerId") Long ownerId);

    Optional<Space> findById(Long id);
}