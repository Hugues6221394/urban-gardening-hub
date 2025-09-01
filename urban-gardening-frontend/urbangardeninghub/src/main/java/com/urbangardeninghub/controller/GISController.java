package com.urbangardeninghub.controller;

import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.service.GISService;
import com.urbangardeninghub.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gis")
@RequiredArgsConstructor
public class GISController {
    private final SpaceService spaceService;
    private final GISService gisService;

    @GetMapping("/spaces/nearby")
    public ResponseEntity<List<Space>> getSpacesNearby(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius) {
        List<Space> spaces = spaceService.findSpacesNearLocation(lat, lng, radius);
        return ResponseEntity.ok(spaces);
    }

    @PostMapping("/analyze-space")
    public ResponseEntity<Map<String, Object>> analyzeSpace(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) String address) {

        double sunlightHours = gisService.calculateSunlightHours(lat, lng);
        double soilQuality = gisService.assessSoilQuality(lat, lng, address);

        Map<String, Object> response = new HashMap<>();
        response.put("sunlightHours", sunlightHours);
        response.put("soilQuality", soilQuality);
        response.put("suitabilityScore", calculateSuitabilityScore(sunlightHours, soilQuality));

        return ResponseEntity.ok(response);
    }

    private String calculateSuitabilityScore(double sunlightHours, double soilQuality) {
        double score = (sunlightHours / 12.0 * 0.6) + (soilQuality / 10.0 * 0.4);

        if (score >= 0.8) return "EXCELLENT";
        if (score >= 0.6) return "GOOD";
        if (score >= 0.4) return "FAIR";
        return "POOR";
    }
}