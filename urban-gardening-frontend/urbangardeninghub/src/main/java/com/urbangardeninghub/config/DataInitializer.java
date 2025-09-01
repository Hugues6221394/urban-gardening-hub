package com.urbangardeninghub.config;

import com.urbangardeninghub.entity.Space;
import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.SpaceRepository;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users if none exist
        if (userRepository.count() == 0) {
            User landOwner = User.builder()
                    .email("landowner@example.com")
                    .password(passwordEncoder.encode("password"))
                    .firstName("John")
                    .lastName("Doe")
                    .phoneNumber("+250788123456")
                    .userType(User.UserType.LANDOWNER)
                    .isVerified(true)
                    .build();

            User farmer = User.builder()
                    .email("farmer@example.com")
                    .password(passwordEncoder.encode("password"))
                    .firstName("Jane")
                    .lastName("Smith")
                    .phoneNumber("+250788654321")
                    .userType(User.UserType.URBAN_FARMER)
                    .isVerified(true)
                    .build();

            userRepository.save(landOwner);
            userRepository.save(farmer);

            // Create sample spaces
            Space space1 = Space.builder()
                    .title("Rooftop in Kigali City")
                    .description("Large rooftop space with good sunlight exposure")
                    .spaceType(Space.SpaceType.ROOFTOP)
                    .area(120.0)
                    .latitude(-1.9706)
                    .longitude(30.1044)
                    .address("KN 123 St, Kigali")
                    .sunlightHours(8.5)
                    .hasWaterAccess(true)
                    .soilQuality(7.5)
                    .status(Space.SpaceStatus.AVAILABLE)
                    .rentPrice(java.math.BigDecimal.valueOf(50000))
                    .owner(landOwner)
                    .build();

            Space space2 = Space.builder()
                    .title("Vacant Lot in Nyamirambo")
                    .description("Sunny vacant lot perfect for vegetable garden")
                    .spaceType(Space.SpaceType.VACANT_LOT)
                    .area(200.0)
                    .latitude(-1.9536)
                    .longitude(30.0606)
                    .address("NY 456 St, Nyamirambo")
                    .sunlightHours(7.0)
                    .hasWaterAccess(false)
                    .soilQuality(6.0)
                    .status(Space.SpaceStatus.AVAILABLE)
                    .rentPrice(java.math.BigDecimal.valueOf(35000))
                    .owner(landOwner)
                    .build();

            spaceRepository.save(space1);
            spaceRepository.save(space2);
        }
    }
}