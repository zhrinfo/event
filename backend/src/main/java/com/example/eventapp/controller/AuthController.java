package com.example.eventapp.controller;

import com.example.eventapp.dto.AuthRequest;
import org.springframework.security.core.GrantedAuthority;
import com.example.eventapp.dto.AuthResponse;
import com.example.eventapp.model.User;
import com.example.eventapp.security.JwtUtils;
import com.example.eventapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest req) {
        User u = userService.register(req.getEmail(), req.getPassword(), null);
        String token = jwtUtils.generateToken(u.getEmail());
        
        // Get user role (default to ROLE_USER if no roles)
        String role = u.getRoles().stream()
            .findFirst()
            .map(r -> r.name())
            .orElse("ROLE_USER");
            
        return ResponseEntity.ok(new AuthResponse(u.getId(), token, u.getEmail(), role));
    }

        @PostMapping("/login")
        public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtUtils.generateToken(req.getEmail());
            
            // Get user details
            User user = userService.findByEmail(req.getEmail());
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            
            // Get the first authority as role (or ROLE_USER by default if no authorities)
            String role = auth.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");
                
            return ResponseEntity.ok(new AuthResponse(user.getId(), token, req.getEmail(), role));
        }
}
