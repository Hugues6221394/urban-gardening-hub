package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.SpaceRepository;
import com.urbangardeninghub.repository.UserRepository;
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
    private final UserRepository userRepository;

    public Space createSpace(Space space, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        space.setOwner(owner);
        Space enhancedSpace = gisService.enhanceSpaceWithGISData(space);
        return spaceRepository.save(enhancedSpace);
    }

    public Space updateSpace(Long spaceId, Space spaceDetails, Long userId) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        // Check if user owns the space or is admin
        if (!space.getOwner().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to update this space");
        }

        space.setTitle(spaceDetails.getTitle());
        space.setDescription(spaceDetails.getDescription());
        space.setSpaceType(spaceDetails.getSpaceType());
        space.setArea(spaceDetails.getArea());
        space.setAddress(spaceDetails.getAddress());
        space.setRentPrice(spaceDetails.getRentPrice());
        space.setHasWaterAccess(spaceDetails.getHasWaterAccess());

        // Only update location if provided
        if (spaceDetails.getLatitude() != null && spaceDetails.getLongitude() != null) {
            space.setLatitude(spaceDetails.getLatitude());
            space.setLongitude(spaceDetails.getLongitude());
            // Recalculate GIS data
            space = gisService.enhanceSpaceWithGISData(space);
        }

        return spaceRepository.save(space);
    }

    public void deleteSpace(Long spaceId, Long userId) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        // Check if user owns the space or is admin
        if (!space.getOwner().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to delete this space");
        }

        spaceRepository.delete(space);
    }

    public Space updateSpaceStatus(Long spaceId, Space.SpaceStatus status, Long userId) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));

        // Check if user owns the space, is the farmer, or is admin
        boolean isOwner = space.getOwner().getId().equals(userId);
        boolean isFarmer = space.getFarmer() != null && space.getFarmer().getId().equals(userId);
        boolean isAdmin = userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN);

        if (!isOwner && !isFarmer && !isAdmin) {
            throw new RuntimeException("Unauthorized to update this space");
        }

        space.setStatus(status);
        return spaceRepository.save(space);
    }

    public Space assignFarmer(Long spaceId, Long farmerId, Long userId) {
        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new RuntimeException("Space not found"));
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        // Check if user owns the space or is admin
        if (!space.getOwner().getId().equals(userId) &&
                !userRepository.findById(userId).get().hasRole(User.Role.ROLE_ADMIN)) {
            throw new RuntimeException("Unauthorized to assign farmer to this space");
        }

        // Check if farmer has the correct user type
        if (farmer.getUserType() != User.UserType.URBAN_FARMER) {
            throw new RuntimeException("User is not an urban farmer");
        }

        space.setFarmer(farmer);
        space.setStatus(Space.SpaceStatus.RENTED);
        return spaceRepository.save(space);
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