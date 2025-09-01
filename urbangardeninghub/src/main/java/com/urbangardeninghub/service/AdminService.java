package com.urbangardeninghub.service;


import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Page<User> getUsersByType(User.UserType userType, Pageable pageable) {
        return userRepository.findByUserType(userType, pageable);
    }

    public User updateUserStatus(Long userId, Boolean isActive, Boolean isVerified) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (isActive != null) {
            user.setIsActive(isActive);
        }

        if (isVerified != null) {
            user.setIsVerified(isVerified);
        }

        return userRepository.save(user);
    }

    public Map<String, Object> getUserStats() {
        Map<String, Object> stats = new java.util.HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countByIsActiveTrue());
        stats.put("verifiedUsers", userRepository.countByIsVerifiedTrue());

        for (User.UserType type : User.UserType.values()) {
            long count = userRepository.countByUserType(type);
            stats.put(type.name().toLowerCase() + "Count", count);
        }

        return stats;
    }
}