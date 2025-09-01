package com.urbangardeninghub.controller;

import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.service.AIRecommendationService;
import com.urbangardeninghub.service.SpaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
public class SpaceController {
    private final SpaceService spaceService;
    private final AIRecommendationService aiService;

    @PostMapping
    public ResponseEntity<Space> createSpace(@RequestBody Space space) {
        Space createdSpace = spaceService.createSpace(space);
        return ResponseEntity.ok(createdSpace);
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