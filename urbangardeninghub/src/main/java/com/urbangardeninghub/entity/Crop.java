package com.urbangardeninghub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crops")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Crop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String variety;

    @Enumerated(EnumType.STRING)
    private CropCategory category;

    private LocalDate plantingDate;
    private LocalDate expectedHarvestDate;
    private Integer growthDuration; // in days

    private Double quantity; // planted quantity
    private String unit; // kg, pieces, etc.

    @Enumerated(EnumType.STRING)
    private GrowthStage growthStage;

    private BigDecimal estimatedYield;
    private BigDecimal actualYield;

    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum CropCategory {
        LEAFY_GREENS, HERBS, VEGETABLES, FRUITS, ROOT_VEGETABLES
    }

    public enum GrowthStage {
        PLANTED, GERMINATED, GROWING, FLOWERING, READY_FOR_HARVEST, HARVESTED
    }
}