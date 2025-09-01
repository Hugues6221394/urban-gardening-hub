package com.urbangardeninghub.controller;

import com.urbangardeninghub.config.UserPrincipal;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();

        Map<String, Object> dashboardData;

        switch (user.getUserType()) {
            case LANDOWNER:
                dashboardData = dashboardService.getLandownerDashboard(user.getId());
                break;
            case URBAN_FARMER:
                dashboardData = dashboardService.getUrbanFarmerDashboard(user.getId());
                break;
            case ADMIN:
                dashboardData = dashboardService.getAdminDashboard();
                break;
            case RESTAURANT:
            case SUPERMARKET:
            case INDIVIDUAL:
                dashboardData = dashboardService.getBuyerDashboard(user.getId(), user.getUserType());
                break;
            default:
                dashboardData = Map.of("message", "No dashboard available for this user type");
        }

        // Add user info to dashboard
        dashboardData.put("user", Map.of(
                "id", user.getId(),
                "name", user.getFirstName() + " " + user.getLastName(),
                "email", user.getEmail(),
                "userType", user.getUserType()
        ));

        return ResponseEntity.ok(dashboardData);
    }
}