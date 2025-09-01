package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.Crop;
import com.urbangardeninghub.entity.Space;
import org.springframework.stereotype.Service;

import java.util.*;

// Update AIRecommendationService.java
@Service
public class AIRecommendationService {
    private static final Map<String, CropRequirements> CROP_DATABASE = new HashMap<>();

    static {
        // Initialize crop database with requirements
        CROP_DATABASE.put("Tomatoes", new CropRequirements(6, 8, 6, 7, 21, 28));
        CROP_DATABASE.put("Lettuce", new CropRequirements(4, 6, 5, 7, 14, 21));
        CROP_DATABASE.put("Spinach", new CropRequirements(4, 6, 5, 7, 12, 18));
        CROP_DATABASE.put("Kale", new CropRequirements(4, 6, 5, 7, 14, 21));
        CROP_DATABASE.put("Herbs", new CropRequirements(4, 8, 5, 8, 14, 28));
        CROP_DATABASE.put("Peppers", new CropRequirements(6, 8, 6, 7, 21, 28));
        CROP_DATABASE.put("Cucumbers", new CropRequirements(6, 8, 6, 7, 21, 28));
        CROP_DATABASE.put("Carrots", new CropRequirements(4, 6, 5, 7, 21, 28));
        CROP_DATABASE.put("Radishes", new CropRequirements(4, 6, 5, 7, 7, 14));
        CROP_DATABASE.put("Beans", new CropRequirements(6, 8, 6, 7, 14, 21));
        CROP_DATABASE.put("Mushrooms", new CropRequirements(0, 2, 5, 7, 7, 14));
        CROP_DATABASE.put("Microgreens", new CropRequirements(2, 4, 5, 7, 7, 14));
    }

    public List<CropRecommendation> recommendCrops(Space space) {
        List<CropRecommendation> recommendations = new ArrayList<>();

        for (Map.Entry<String, CropRequirements> entry : CROP_DATABASE.entrySet()) {
            String cropName = entry.getKey();
            CropRequirements requirements = entry.getValue();

            double suitabilityScore = calculateSuitabilityScore(space, requirements);

            if (suitabilityScore >= 0.6) { // Only recommend suitable crops
                double estimatedYield = calculateYieldPrediction(space, cropName);
                double profitability = calculateProfitability(cropName, estimatedYield);

                CropRecommendation recommendation = new CropRecommendation();
                recommendation.setCropName(cropName);
                recommendation.setSuitabilityScore(suitabilityScore);
                recommendation.setEstimatedYield(estimatedYield);
                recommendation.setProfitability(profitability);
                recommendation.setGrowthDays(requirements.getGrowthDays());

                recommendations.add(recommendation);
            }
        }

        // Sort by suitability score (highest first)
        recommendations.sort((a, b) -> Double.compare(b.getSuitabilityScore(), a.getSuitabilityScore()));

        return recommendations;
    }

    private double calculateSuitabilityScore(Space space, CropRequirements requirements) {
        double score = 0.0;

        // Sunlight score (40% weight)
        if (space.getSunlightHours() != null) {
            double sunlightScore = calculateParameterScore(
                    space.getSunlightHours(),
                    requirements.getMinSunlight(),
                    requirements.getMaxSunlight()
            );
            score += sunlightScore * 0.4;
        }

        // Soil quality score (30% weight)
        if (space.getSoilQuality() != null) {
            double soilScore = calculateParameterScore(
                    space.getSoilQuality(),
                    requirements.getMinSoilQuality(),
                    requirements.getMaxSoilQuality()
            );
            score += soilScore * 0.3;
        }

        // Water access score (30% weight)
        if (space.getHasWaterAccess() != null) {
            double waterScore = space.getHasWaterAccess() ? 1.0 : 0.5;
            score += waterScore * 0.3;
        }

        return score;
    }

    private double calculateParameterScore(double value, double min, double max) {
        if (value < min) return value / min;
        if (value > max) return 1.0 - ((value - max) / (max * 2)); // Penalize for exceeding max
        return 1.0; // Perfect score within range
    }

    public Double calculateYieldPrediction(Space space, String cropType) {
        CropRequirements requirements = CROP_DATABASE.get(cropType);
        if (requirements == null) return 0.0;

        double baseYield = space.getArea() * getBaseYieldPerSqm(cropType);

        // Adjust for sunlight
        if (space.getSunlightHours() != null) {
            double sunlightFactor = Math.min(1.0, space.getSunlightHours() / requirements.getMaxSunlight());
            baseYield *= (0.7 + (sunlightFactor * 0.3));
        }

        // Adjust for soil quality
        if (space.getSoilQuality() != null) {
            double soilFactor = space.getSoilQuality() / 10.0;
            baseYield *= (0.6 + (soilFactor * 0.4));
        }

        return baseYield;
    }

    private double getBaseYieldPerSqm(String cropType) {
        switch (cropType) {
            case "Tomatoes": return 5.0;
            case "Lettuce": return 3.0;
            case "Spinach": return 2.5;
            case "Kale": return 2.0;
            case "Herbs": return 1.5;
            case "Peppers": return 3.0;
            case "Cucumbers": return 4.0;
            case "Carrots": return 2.0;
            case "Radishes": return 4.0;
            case "Beans": return 2.5;
            case "Mushrooms": return 6.0;
            case "Microgreens": return 8.0;
            default: return 2.0;
        }
    }

    private double calculateProfitability(String cropType, double yield) {
        Map<String, Double> marketPrices = new HashMap<>();
        marketPrices.put("Tomatoes", 800.0);
        marketPrices.put("Lettuce", 600.0);
        marketPrices.put("Spinach", 700.0);
        marketPrices.put("Kale", 650.0);
        marketPrices.put("Herbs", 1200.0);
        marketPrices.put("Peppers", 900.0);
        marketPrices.put("Cucumbers", 500.0);
        marketPrices.put("Carrots", 400.0);
        marketPrices.put("Radishes", 550.0);
        marketPrices.put("Beans", 750.0);
        marketPrices.put("Mushrooms", 1500.0);
        marketPrices.put("Microgreens", 2000.0);

        double pricePerKg = marketPrices.getOrDefault(cropType, 500.0);
        return yield * pricePerKg;
    }

    // Inner classes for data structures
    private static class CropRequirements {
        private final double minSunlight;
        private final double maxSunlight;
        private final double minSoilQuality;
        private final double maxSoilQuality;
        private final int minGrowthDays;
        private final int maxGrowthDays;

        public CropRequirements(double minSunlight, double maxSunlight,
                                double minSoilQuality, double maxSoilQuality,
                                int minGrowthDays, int maxGrowthDays) {
            this.minSunlight = minSunlight;
            this.maxSunlight = maxSunlight;
            this.minSoilQuality = minSoilQuality;
            this.maxSoilQuality = maxSoilQuality;
            this.minGrowthDays = minGrowthDays;
            this.maxGrowthDays = maxGrowthDays;
        }

        // Getters
        public double getMinSunlight() { return minSunlight; }
        public double getMaxSunlight() { return maxSunlight; }
        public double getMinSoilQuality() { return minSoilQuality; }
        public double getMaxSoilQuality() { return maxSoilQuality; }
        public int getMinGrowthDays() { return minGrowthDays; }
        public int getMaxGrowthDays() { return maxGrowthDays; }
        public int getGrowthDays() { return (minGrowthDays + maxGrowthDays) / 2; }
    }

    public static class CropRecommendation {
        private String cropName;
        private double suitabilityScore;
        private double estimatedYield;
        private double profitability;
        private int growthDays;

        // Getters and Setters
        public String getCropName() { return cropName; }
        public void setCropName(String cropName) { this.cropName = cropName; }
        public double getSuitabilityScore() { return suitabilityScore; }
        public void setSuitabilityScore(double suitabilityScore) { this.suitabilityScore = suitabilityScore; }
        public double getEstimatedYield() { return estimatedYield; }
        public void setEstimatedYield(double estimatedYield) { this.estimatedYield = estimatedYield; }
        public double getProfitability() { return profitability; }
        public void setProfitability(double profitability) { this.profitability = profitability; }
        public int getGrowthDays() { return growthDays; }
        public void setGrowthDays(int growthDays) { this.growthDays = growthDays; }
    }
}