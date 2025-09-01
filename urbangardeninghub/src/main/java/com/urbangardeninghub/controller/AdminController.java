package com.urbangardeninghub.controller;

import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));

        Page<User> users = adminService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{userType}")
    public ResponseEntity<Page<User>> getUsersByType(
            @PathVariable User.UserType userType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> users = adminService.getUsersByType(userType, pageable);
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isVerified) {

        User updatedUser = adminService.updateUserStatus(userId, isActive, isVerified);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/stats/users")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = adminService.getUserStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/system")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        // This would include space stats, transaction stats, etc.
        // Implementation would depend on other services
        Map<String, Object> stats = Map.of(
                "message", "System stats endpoint - to be implemented with additional services"
        );
        return ResponseEntity.ok(stats);
    }
}