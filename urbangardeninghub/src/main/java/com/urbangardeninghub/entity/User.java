package com.urbangardeninghub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    // Add role-based authorization
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();

    // Add method to check if user has a specific role
    public boolean hasRole(Role role) {
        return roles.contains(role);
    }

    // Add method to assign role
    public void addRole(Role role) {
        roles.add(role);
    }

    private String address;
    private Double latitude;
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Boolean isVerified = false;
    private Boolean isActive = true;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Space> ownedSpaces;

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL)
    private List<Space> farmedSpaces;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private GreenPartnerStatus greenPartnerStatus = GreenPartnerStatus.NOT_CERTIFIED;

    private LocalDateTime certificationDate;

    public enum GreenPartnerStatus {
        NOT_CERTIFIED, PENDING, CERTIFIED, REVOKED
    }

    public enum UserType {
        URBAN_FARMER, LANDOWNER, RESTAURANT, SUPERMARKET, INDIVIDUAL, ADMIN
    }

    public enum Role {
        ROLE_USER, ROLE_LANDOWNER, ROLE_FARMER, ROLE_BUYER, ROLE_ADMIN, ROLE_MODERATOR
    }

}