package com.urbangardeninghub.repository;

import com.urbangardeninghub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByUserType(User.UserType userType);
    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.userType = :type AND " +
            "SQRT(POWER(u.latitude - :lat, 2) + POWER(u.longitude - :lng, 2)) < :radius")
    List<User> findNearbyUsers(@Param("type") User.UserType type,
                               @Param("lat") Double latitude,
                               @Param("lng") Double longitude,
                               @Param("radius") Double radius);

    long countByIsVerifiedFalse();
    List<User> findTop5ByOrderByCreatedAtDesc();

    List<User> findByGreenPartnerStatus(User.GreenPartnerStatus greenPartnerStatus);
}
