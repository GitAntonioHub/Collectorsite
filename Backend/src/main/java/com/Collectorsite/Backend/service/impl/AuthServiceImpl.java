package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.service.AuthService;
import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.RoleName;
import com.Collectorsite.Backend.repository.*;
import com.Collectorsite.Backend.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.*;
import java.util.Optional;

@Service @RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AppUserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwt;

    @Override
    public AuthResponse register(RegisterRequest request) {
        AppUser user = AppUser.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        if (user.getRoles() == null) user.setRoles(new java.util.HashSet<>());

        Role userRole = roleRepo.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role not initialized"));

        user.getRoles().add(userRole);
        userRepo.save(user);

        return new AuthResponse(jwt.createToken(user.getUsername(), user.getRoles()));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Try to find user by username first, then by email if not found
        Optional<AppUser> userOpt = userRepo.findByUsername(request.getIdentifier());
        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByEmail(request.getIdentifier());
        }

        AppUser user = userOpt.orElseThrow(() -> 
            new RuntimeException("No user found with the provided username or email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new AuthResponse(jwt.createToken(user.getUsername(), user.getRoles()));
    }
}
