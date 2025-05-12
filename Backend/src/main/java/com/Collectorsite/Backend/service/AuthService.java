package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.LoginRequest;
import com.Collectorsite.Backend.dto.RegisterRequest;
import com.Collectorsite.Backend.dto.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
