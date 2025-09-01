package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.TransactionRepository;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public boolean checkEligibility(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is a business (restaurant or supermarket)
        if (user.getUserType() != User.UserType.RESTAURANT &&
                user.getUserType() != User.UserType.SUPERMARKET) {
            return false;
        }

        // Check if user has at least 10 local purchases
        long localPurchases = transactionRepository.countLocalPurchases(userId);
        return localPurchases >= 10;
    }

    public void applyForCertification(Long userId) {
        if (!checkEligibility(userId)) {
            throw new RuntimeException("User is not eligible for certification");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // In a real implementation, this would create a certification application
        // For now, we'll just set a flag
        user.setGreenPartnerStatus(User.GreenPartnerStatus.PENDING);
        userRepository.save(user);
    }

    public void approveCertification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setGreenPartnerStatus(User.GreenPartnerStatus.CERTIFIED);
        user.setCertificationDate(LocalDateTime.now());
        userRepository.save(user);
    }

    public void revokeCertification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setGreenPartnerStatus(User.GreenPartnerStatus.NOT_CERTIFIED);
        user.setCertificationDate(null);
        userRepository.save(user);
    }

    public List<User> getCertifiedPartners() {
        return userRepository.findByGreenPartnerStatus(User.GreenPartnerStatus.CERTIFIED);
    }

    public List<User> getPendingApplications() {
        return userRepository.findByGreenPartnerStatus(User.GreenPartnerStatus.PENDING);
    }
}