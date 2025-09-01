package com.urbangardeninghub.controller;

import com.urbangardeninghub.entity.IoTData;
import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.repository.IoTDataRepository;
import com.urbangardeninghub.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/iot")
@RequiredArgsConstructor
public class IoTController {
    private final IoTDataRepository ioTDataRepository;
    private final SpaceRepository spaceRepository;

    @PostMapping("/data")
    public ResponseEntity<?> receiveIoTData(@RequestBody IoTDataRequest request) {
        try {
            Optional<Space> spaceOpt = spaceRepository.findById(request.getSpaceId());
            if (!spaceOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Space not found"));
            }

            IoTData data = IoTData.builder()
                    .space(spaceOpt.get())
                    .sensorId(request.getSensorId())
                    .sensorType(request.getSensorType())
                    .value(request.getValue())
                    .unit(request.getUnit())
                    .temperature(request.getTemperature())
                    .humidity(request.getHumidity())
                    .soilMoisture(request.getSoilMoisture())
                    .lightIntensity(request.getLightIntensity())
                    .phLevel(request.getPhLevel())
                    .timestamp(LocalDateTime.now())
                    .build();

            ioTDataRepository.save(data);

            // Check for alerts (e.g., low soil moisture)
            checkForAlerts(data);

            return ResponseEntity.ok(Map.of("message", "Data received successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/data/space/{spaceId}")
    public ResponseEntity<List<IoTData>> getIoTDataForSpace(
            @PathVariable Long spaceId,
            @RequestParam(required = false) IoTData.SensorType sensorType,
            @RequestParam(required = false) Integer hours) {

        List<IoTData> data;
        if (sensorType != null && hours != null) {
            LocalDateTime startTime = LocalDateTime.now().minusHours(hours);
            data = ioTDataRepository.findBySpaceIdAndSensorTypeAndTimeRange(
                    spaceId, sensorType, startTime, LocalDateTime.now());
        } else if (sensorType != null) {
            data = ioTDataRepository.findBySpaceIdAndSensorType(spaceId, sensorType);
        } else if (hours != null) {
            LocalDateTime startTime = LocalDateTime.now().minusHours(hours);
            data = ioTDataRepository.findBySpaceIdAndTimeRange(
                    spaceId, startTime, LocalDateTime.now());
        } else {
            data = ioTDataRepository.findBySpaceId(spaceId);
        }

        return ResponseEntity.ok(data);
    }

    @PostMapping("/control/irrigation")
    public ResponseEntity<?> controlIrrigation(
            @RequestParam Long spaceId,
            @RequestParam boolean turnOn) {

        // In a real implementation, this would send a command to the IoT device
        String action = turnOn ? "START" : "STOP";
        String message = "Irrigation system command sent: " + action;

        // Log the action (in production, this would interface with actual IoT devices)
        System.out.println("Space " + spaceId + ": " + message);

        return ResponseEntity.ok(Map.of("message", message, "action", action));
    }

    private void checkForAlerts(IoTData data) {
        // Check soil moisture alerts
        if (data.getSoilMoisture() != null && data.getSoilMoisture() < 20) {
            System.out.println("ALERT: Low soil moisture (" + data.getSoilMoisture() + "%) detected in space " +
                    data.getSpace().getId() + ". Consider irrigation.");
        }

        // Check pH alerts
        if (data.getPhLevel() != null && (data.getPhLevel() < 5.5 || data.getPhLevel() > 7.5)) {
            System.out.println("ALERT: Suboptimal pH level (" + data.getPhLevel() + ") detected in space " +
                    data.getSpace().getId() + ". Soil amendment may be needed.");
        }

        // Check temperature alerts
        if (data.getTemperature() != null && data.getTemperature() > 35) {
            System.out.println("ALERT: High temperature (" + data.getTemperature() + "°C) detected in space " +
                    data.getSpace().getId() + ". Consider providing shade.");
        }
    }

    // Request DTO for IoT data
    public static class IoTDataRequest {
        private Long spaceId;
        private String sensorId;
        private IoTData.SensorType sensorType;
        private Double value;
        private String unit;
        private Double temperature;
        private Double humidity;
        private Double soilMoisture;
        private Double lightIntensity;
        private Double phLevel;

        // Getters and Setters
        public Long getSpaceId() { return spaceId; }
        public void setSpaceId(Long spaceId) { this.spaceId = spaceId; }
        public String getSensorId() { return sensorId; }
        public void setSensorId(String sensorId) { this.sensorId = sensorId; }
        public IoTData.SensorType getSensorType() { return sensorType; }
        public void setSensorType(IoTData.SensorType sensorType) { this.sensorType = sensorType; }
        public Double getValue() { return value; }
        public void setValue(Double value) { this.value = value; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public Double getTemperature() { return temperature; }
        public void setTemperature(Double temperature) { this.temperature = temperature; }
        public Double getHumidity() { return humidity; }
        public void setHumidity(Double humidity) { this.humidity = humidity; }
        public Double getSoilMoisture() { return soilMoisture; }
        public void setSoilMoisture(Double soilMoisture) { this.soilMoisture = soilMoisture; }
        public Double getLightIntensity() { return lightIntensity; }
        public void setLightIntensity(Double lightIntensity) { this.lightIntensity = lightIntensity; }
        public Double getPhLevel() { return phLevel; }
        public void setPhLevel(Double phLevel) { this.phLevel = phLevel; }
    }
}