package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Marketplace;
import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.SpaceRepository;
import com.urbangardeninghub.repository.MarketplaceRepository;
import com.urbangardeninghub.repository.TransactionRepository;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final SpaceRepository spaceRepository;
    private final MarketplaceRepository marketplaceRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getLandownerDashboard(Long userId) {
        Map<String, Object> dashboard = new HashMap<>();

        long totalSpaces = spaceRepository.countByOwnerId(userId);
        long rentedSpaces = spaceRepository.countByOwnerIdAndStatus(userId, Space.SpaceStatus.RENTED);
        long availableSpaces = spaceRepository.countByOwnerIdAndStatus(userId, Space.SpaceStatus.AVAILABLE);

        dashboard.put("totalSpaces", totalSpaces);
        dashboard.put("rentedSpaces", rentedSpaces);
        dashboard.put("availableSpaces", availableSpaces);
        dashboard.put("monthlyRentalIncome", calculateMonthlyIncome(userId));
        dashboard.put("recentSpaces", spaceRepository.findTop5ByOwnerIdOrderByCreatedAtDesc(userId));

        return dashboard;
    }

    public Map<String, Object> getUrbanFarmerDashboard(Long userId) {
        Map<String, Object> dashboard = new HashMap<>();

        long farmingSpaces = spaceRepository.countByFarmerId(userId);
        long activeListings = marketplaceRepository.countBySellerIdAndStatus(userId, Marketplace.ListingStatus.ACTIVE);
        double monthlyEarnings = calculateMonthlyEarnings(userId);

        dashboard.put("farmingSpaces", farmingSpaces);
        dashboard.put("activeListings", activeListings);
        dashboard.put("monthlyEarnings", monthlyEarnings);
        dashboard.put("recentListings", marketplaceRepository.findTop5BySellerIdOrderByCreatedAtDesc(userId));

        return dashboard;
    }

    public Map<String, Object> getBuyerDashboard(Long userId, User.UserType userType) {
        Map<String, Object> dashboard = new HashMap<>();

        long purchases = transactionRepository.countByBuyerId(userId);
        double totalSpent = transactionRepository.sumTotalAmountByBuyerId(userId);

        dashboard.put("totalPurchases", purchases);
        dashboard.put("totalSpent", totalSpent != 0 ? totalSpent : 0.0);
        dashboard.put("recentPurchases", transactionRepository.findTop5ByBuyerIdOrderByCreatedAtDesc(userId));

        if (userType == User.UserType.RESTAURANT || userType == User.UserType.SUPERMARKET) {
            dashboard.put("greenPartnerStatus", checkGreenPartnerStatus(userId));
        }

        return dashboard;
    }

    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalSpaces = spaceRepository.count();
        long totalListings = marketplaceRepository.count();
        long totalTransactions = transactionRepository.count();
        double platformRevenue = transactionRepository.sumPlatformCommission();

        dashboard.put("totalUsers", totalUsers);
        dashboard.put("totalSpaces", totalSpaces);
        dashboard.put("totalListings", totalListings);
        dashboard.put("totalTransactions", totalTransactions);
        dashboard.put("platformRevenue", platformRevenue != 0 ? platformRevenue : 0.0);
        dashboard.put("recentSignups", userRepository.findTop5ByOrderByCreatedAtDesc());
        dashboard.put("pendingVerifications", userRepository.countByIsVerifiedFalse());

        return dashboard;
    }

    private Double calculateMonthlyIncome(Long ownerId) {
        // Implementation to calculate monthly rental income
        return spaceRepository.sumRentPriceByOwnerIdAndStatus(ownerId, Space.SpaceStatus.RENTED);
    }

    private Double calculateMonthlyEarnings(Long farmerId) {
        // Implementation to calculate monthly earnings from sales
        return transactionRepository.sumTotalAmountBySellerId(farmerId);
    }

    private String checkGreenPartnerStatus(Long buyerId) {
        // Implementation to check Green City Partner status
        long localPurchases = transactionRepository.countLocalPurchases(buyerId);
        if (localPurchases >= 10) {
            return "CERTIFIED";
        } else if (localPurchases >= 5) {
            return "PENDING";
        }
        return "NOT_ELIGIBLE";
    }
}