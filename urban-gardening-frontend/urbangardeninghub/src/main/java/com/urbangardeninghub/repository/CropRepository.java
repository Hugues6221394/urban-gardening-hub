package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findBySpaceId(Long spaceId);
    List<Crop> findByGrowthStage(Crop.GrowthStage growthStage);
    List<Crop> findByCategory(Crop.CropCategory category);
}