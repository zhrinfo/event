package com.example.eventapp.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateToken(String subject) {
        Algorithm alg = Algorithm.HMAC256(jwtSecret);
        return JWT.create()
                .withSubject(subject)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(alg);
    }

    public String getSubject(String token) {
        DecodedJWT jwt = JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
        return jwt.getSubject();
    }

    public boolean validate(String token) {
        try {
            System.out.println("🔍 JWT Validation - Token: " + token.substring(0, Math.min(token.length(), 30)) + "...");
            System.out.println("🔑 JWT Secret: " + jwtSecret.substring(0, Math.min(jwtSecret.length(), 10)) + "...");
            
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(jwtSecret)).build().verify(token);
            System.out.println("✅ JWT Valid - Subject: " + jwt.getSubject());
            System.out.println("✅ JWT Valid - Expires: " + jwt.getExpiresAt());
            return true;
        } catch (Exception e) {
            System.out.println("❌ JWT Invalid - Error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
