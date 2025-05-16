package com.Collectorsite.Backend.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginRequest {
    private String identifier;  // can be either username or email
    private String password;
}
