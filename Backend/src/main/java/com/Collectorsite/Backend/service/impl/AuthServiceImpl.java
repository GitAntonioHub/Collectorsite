package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.service.AuthService;
import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.RoleName;
import com.Collectorsite.Backend.repository.*;
import com.Collectorsite.Backend.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

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

        Role userRole = roleRepo.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role not initialized"));

        user.getRoles().add(userRole);
        userRepo.save(user);

        return new AuthResponse(jwt.createToken(user.getUsername(), user.getRoles()));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash()))
            throw new RuntimeException("Invalid credentials");

        return new AuthResponse(jwt.createToken(user.getUsername(), user.getRoles()));
    }
}
