package com.example.eventapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        System.out.println("🔍 JWT Filter processing path: " + path);
        
        String header = request.getHeader("Authorization");
        System.out.println("📋 Authorization header: " + (header != null ? "Present" : "Missing"));
        
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("🎫 Token extracted: " + token.substring(0, Math.min(token.length(), 20)) + "...");
            
            if (jwtUtils.validate(token)) {
                String username = jwtUtils.getSubject(token);
                System.out.println("✅ Token valid for user: " + username);
                
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("🔐 Authentication set successfully");
                } catch (Exception e) {
                    System.out.println("❌ Error loading user: " + e.getMessage());
                }
            } else {
                System.out.println("❌ Token validation failed");
            }
        } else {
            System.out.println("⚠️ No Bearer token found");
        }
        
        filterChain.doFilter(request, response);
    }
}
