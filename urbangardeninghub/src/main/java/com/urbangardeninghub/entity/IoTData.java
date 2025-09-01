package com.urbangardeninghub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "iot_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class IoTData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "space_id")
    private Space space;

    private String sensorId;

    @Enumerated(EnumType.STRING)
    private SensorType sensorType;

    private Double value;
    private String unit;

    private Double temperature; // Celsius
    private Double humidity; // percentage
    private Double soilMoisture; // percentage
    private Double lightIntensity; // lux
    private Double phLevel;

    @CreatedDate
    private LocalDateTime timestamp;

    public enum SensorType {
        TEMPERATURE, HUMIDITY, SOIL_MOISTURE, LIGHT, PH_LEVEL, WATER_LEVEL
    }
}