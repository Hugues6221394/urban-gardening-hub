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
import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Marketplace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "crop_id")
    private Crop crop;

    private Double quantity;
    private String unit;

    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private ListingStatus status;

    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;

    private Boolean isOrganic = true;
    private Boolean isLocallyGrown = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ListingStatus {
        ACTIVE, SOLD, EXPIRED, CANCELLED
    }
}
