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
import java.util.List;

@Entity
@Table(name = "spaces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private SpaceType spaceType;

    private Double area; // in square meters
    private Double latitude;
    private Double longitude;
    private String address;

    // Environmental conditions
    private Double sunlightHours;
    private Boolean hasWaterAccess;
    private Double soilQuality; // 1-10 scale

    @Enumerated(EnumType.STRING)
    private SpaceStatus status;

    private BigDecimal rentPrice; // monthly rent

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private User farmer;

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL)
    private List<Crop> crops;

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL)
    private List<IoTData> iotData;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum SpaceType {
        ROOFTOP, BALCONY, VACANT_LOT, PARKING_LOT, COMMUNITY_GARDEN
    }

    public enum SpaceStatus {
        AVAILABLE, RENTED, UNDER_CULTIVATION, MAINTENANCE
    }
}