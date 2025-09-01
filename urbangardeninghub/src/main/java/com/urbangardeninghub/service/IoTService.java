package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.IoTData;
import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.repository.IoTDataRepository;
import com.urbangardeninghub.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IoTService {
    private final IoTDataRepository ioTDataRepository;
    private final SpaceRepository spaceRepository;

    public IoTData processSensorData(IoTData sensorData) {
        // Validate space exists
        Space space = spaceRepository.findById(sensorData.getSpace().getId())
                .orElseThrow(() -> new RuntimeException("Space not found"));

        sensorData.setSpace(space);
        sensorData.setTimestamp(LocalDateTime.now());

        // Check for alerts
        checkForAlerts(sensorData);

        return ioTDataRepository.save(sensorData);
    }

    public List<IoTData> getSensorData(Long spaceId, LocalDateTime start, LocalDateTime end) {
        return ioTDataRepository.findBySpaceIdAndTimeRange(spaceId, start, end);
    }

    public IoTData getLatestSensorData(Long spaceId, IoTData.SensorType sensorType) {
        List<IoTData> data = ioTDataRepository.findLatestBySpaceIdAndSensorType(spaceId, sensorType, 1);
        return data.isEmpty() ? null : data.get(0);
    }

    private void checkForAlerts(IoTData sensorData) {
        // Soil moisture alerts
        if (sensorData.getSoilMoisture() != null && sensorData.getSoilMoisture() < 20) {
            createAlert(sensorData.getSpace(), "LOW_SOIL_MOISTURE",
                    "Soil moisture is low (" + sensorData.getSoilMoisture() + "%). Consider irrigation.");
        }

        // Temperature alerts
        if (sensorData.getTemperature() != null && sensorData.getTemperature() > 35) {
            createAlert(sensorData.getSpace(), "HIGH_TEMPERATURE",
                    "Temperature is high (" + sensorData.getTemperature() + "°C). Consider providing shade.");
        }

        // pH alerts
        if (sensorData.getPhLevel() != null && (sensorData.getPhLevel() < 5.5 || sensorData.getPhLevel() > 7.5)) {
            createAlert(sensorData.getSpace(), "SUBOPTIMAL_PH",
                    "pH level is suboptimal (" + sensorData.getPhLevel() + "). Soil amendment may be needed.");
        }
    }

    private void createAlert(Space space, String alertType, String message) {
        // In a real implementation, this would create an alert in the database
        // and send notifications to the farmer and/or landowner
        System.out.println("ALERT: Space " + space.getId() + " - " + alertType + ": " + message);

        // For now, we'll just log the alert
        // TODO: Implement proper alert system with notifications
    }
}