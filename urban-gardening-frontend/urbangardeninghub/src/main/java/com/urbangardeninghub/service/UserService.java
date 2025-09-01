package com.urbangardeninghub.service;

import com.urbangardeninghub.entity.User;
import com.urbangardeninghub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findNearbyFarmers(Double latitude, Double longitude, Double radius) {
        return userRepository.findNearbyUsers(User.UserType.URBAN_FARMER, latitude, longitude, radius);
    }

    public List<User> findAllLandowners() {
        return userRepository.findByUserType(User.UserType.LANDOWNER);
    }
}