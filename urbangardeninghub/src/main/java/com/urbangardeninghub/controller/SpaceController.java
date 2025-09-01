package com.urbangardeninghub.controller;

import com.urbangardeninghub.config.UserPrincipal;
import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.repository.SpaceRepository;
import com.urbangardeninghub.service.AIRecommendationService;
import com.urbangardeninghub.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
public class SpaceController {
    private final SpaceService spaceService;
    private final AIRecommendationService aiService;
    private final SpaceRepository spaceRepository;

    @PostMapping
    public ResponseEntity<Space> createSpace(@RequestBody Space space, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Space createdSpace = spaceService.createSpace(space, userPrincipal.getId());
        return ResponseEntity.ok(createdSpace);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Space> updateSpace(@PathVariable Long id, @RequestBody Space spaceDetails, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Space updatedSpace = spaceService.updateSpace(id, spaceDetails, userPrincipal.getId());
        return ResponseEntity.ok(updatedSpace);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSpace(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        spaceService.deleteSpace(id, userPrincipal.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Space> updateSpaceStatus(@PathVariable Long id,
                                                   @RequestParam Space.SpaceStatus status,
                                                   Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Space updatedSpace = spaceService.updateSpaceStatus(id, status, userPrincipal.getId());
        return ResponseEntity.ok(updatedSpace);
    }

    @PostMapping("/{id}/assign-farmer/{farmerId}")
    public ResponseEntity<Space> assignFarmer(@PathVariable Long id,
                                              @PathVariable Long farmerId,
                                              Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Space updatedSpace = spaceService.assignFarmer(id, farmerId, userPrincipal.getId());
        return ResponseEntity.ok(updatedSpace);
    }

    @GetMapping("/my-spaces")
    public ResponseEntity<List<Space>> getMySpaces(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Space> spaces = spaceRepository.findByOwnerId(userPrincipal.getId());
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/my-farms")
    public ResponseEntity<List<Space>> getMyFarms(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        List<Space> spaces = spaceRepository.findByFarmerId(userPrincipal.getId());
        return ResponseEntity.ok(spaces);
    }


    @GetMapping
    public ResponseEntity<List<Space>> getAllSpaces() {
        List<Space> spaces = spaceService.findAvailableSpaces();
        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Space> getSpace(@PathVariable Long id) {
        return spaceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/crop-recommendations")
    public ResponseEntity<List<AIRecommendationService.CropRecommendation>> getCropRecommendations(@PathVariable Long id) {
        return spaceService.findById(id)
                .map(space -> ResponseEntity.ok(aiService.recommendCrops(space)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Space> updateSpaceStatus(@PathVariable Long id,
                                                   @RequestParam Space.SpaceStatus status) {
        Space updatedSpace = spaceService.updateSpaceStatus(id, status);
        return ResponseEntity.ok(updatedSpace);
    }
}