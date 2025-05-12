package com.Collectorsite.Backend.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}
