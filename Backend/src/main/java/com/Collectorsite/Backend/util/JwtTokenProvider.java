package com.Collectorsite.Backend.util;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;

import java.security.Key;
import java.util.Collection;
import java.util.Date;

import com.Collectorsite.Backend.entity.Role;

import javax.crypto.SecretKey;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long expirationMillis;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration}") long expirationSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationSeconds * 1000L;
    }

    public String createToken(String username, Collection<Role> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles.stream()
                        .map(r -> r.getName().name())
                        .toList())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsername(String token) {
        return Jwts.parser()              // ← returns a JwtParserBuilder now
                .verifyWith((SecretKey) key)       //    (replaces setSigningKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validate(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(token);   // will throw if invalid/expired
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}
