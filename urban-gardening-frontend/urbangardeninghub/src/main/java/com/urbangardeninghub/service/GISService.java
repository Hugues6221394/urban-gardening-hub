package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Space;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GISService {
    private static final String SUNLIGHT_API_URL = "https://api.sunlight.io/v1/analysis";
    private static final String SOIL_QUALITY_API_URL = "https://api.soilquality.org/v1/assessment";

    public double calculateSunlightHours(Double latitude, Double longitude) {
        // In a real implementation, this would call a sunlight API
        // For now, we'll simulate based on coordinates
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> request = new HashMap<>();
            request.put("lat", latitude);
            request.put("lng", longitude);
            request.put("year", java.time.Year.now().getValue());

            // Simulated API response
            // ResponseEntity<SunlightResponse> response = restTemplate.postForEntity(
            //     SUNLIGHT_API_URL, request, SunlightResponse.class);
            // return response.getBody().getAverageSunlightHours();

            // Simulation based on Rwanda's location
            return 6.5 + (Math.random() * 4); // Between 6.5-10.5 hours
        } catch (Exception e) {
            // Fallback calculation
            return 7.0 + (Math.random() * 3); // Between 7-10 hours
        }
    }

    public double assessSoilQuality(Double latitude, Double longitude, String address) {
        // In a real implementation, this would call a soil quality API or use satellite data
        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> request = new HashMap<>();
            request.put("lat", latitude);
            request.put("lng", longitude);
            request.put("address", address);

            // Simulated API response
            // ResponseEntity<SoilQualityResponse> response = restTemplate.postForEntity(
            //     SOIL_QUALITY_API_URL, request, SoilQualityResponse.class);
            // return response.getBody().getQualityScore();

            // Simulation - urban areas might have lower soil quality
            if (address != null && address.toLowerCase().contains("kigali")) {
                return 5.0 + (Math.random() * 4); // Between 5-9 for urban areas
            }
            return 6.0 + (Math.random() * 4); // Between 6-10 for other areas
        } catch (Exception e) {
            // Fallback calculation
            return 6.5;
        }
    }

    public Space enhanceSpaceWithGISData(Space space) {
        if (space.getLatitude() != null && space.getLongitude() != null) {
            if (space.getSunlightHours() == null) {
                double sunlightHours = calculateSunlightHours(space.getLatitude(), space.getLongitude());
                space.setSunlightHours(sunlightHours);
            }

            if (space.getSoilQuality() == null) {
                double soilQuality = assessSoilQuality(space.getLatitude(), space.getLongitude(), space.getAddress());
                space.setSoilQuality(soilQuality);
            }
        }
        return space;
    }
}