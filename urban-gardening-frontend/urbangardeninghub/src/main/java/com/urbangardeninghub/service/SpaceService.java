package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpaceService {
    private final SpaceRepository spaceRepository;
    private final GISService gisService;
    private final AIRecommendationService aiService;

    public Space createSpace(Space space) {
        Space enhancedSpace = gisService.enhanceSpaceWithGISData(space);
        return spaceRepository.save(enhancedSpace);
    }

    // Add method to find spaces by location
    public List<Space> findSpacesNearLocation(Double latitude, Double longitude, Double radiusInKm) {
        List<Space> allSpaces = spaceRepository.findByStatus(Space.SpaceStatus.AVAILABLE);

        // Filter spaces within the radius (simplified calculation)
        return allSpaces.stream()
                .filter(space -> isWithinRadius(space, latitude, longitude, radiusInKm))
                .collect(Collectors.toList());
    }

    private boolean isWithinRadius(Space space, Double centerLat, Double centerLng, Double radiusInKm) {
        if (space.getLatitude() == null || space.getLongitude() == null) {
            return false;
        }

        // Haversine formula to calculate distance
        double earthRadius = 6371; // kilometers
        double dLat = Math.toRadians(space.getLatitude() - centerLat);
        double dLng = Math.toRadians(space.getLongitude() - centerLng);

        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(centerLat)) * Math.cos(Math.toRadians(space.getLatitude())) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        double distance = earthRadius * c;

        return distance <= radiusInKm;
    }

    public List<Space> findAvailableSpaces() {
        return spaceRepository.findByStatus(Space.SpaceStatus.AVAILABLE);
    }

    public Optional<Space> findById(Long id) {
        return spaceRepository.findById(id);
    }

    public Space updateSpaceStatus(Long id, Space.SpaceStatus status) {
        Space space = spaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Space not found with id: " + id));
        space.setStatus(status);
        return spaceRepository.save(space);
    }
}