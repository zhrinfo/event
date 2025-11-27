package com.example.eventapp.security;

import com.example.eventapp.model.User;
import com.example.eventapp.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("🔍 Loading user: " + username);
        User user = userRepository.findByEmail(username).orElseThrow(() -> {
            System.out.println("❌ User not found: " + username);
            return new UsernameNotFoundException("User not found");
        });
        
        System.out.println("✅ User found: " + user.getEmail());
        System.out.println("📋 User roles: " + user.getRoles());
        
        List<GrantedAuthority> authorities = user.getRoles().stream().map(r -> {
            String authority = r.name();
            System.out.println("🔑 Adding authority: " + authority);
            return new SimpleGrantedAuthority(authority);
        }).collect(Collectors.toList());
        
        System.out.println("🎯 Total authorities: " + authorities.size());
        
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
