package com.example.eventapp.controller;

import com.example.eventapp.model.Reservation;
import com.example.eventapp.model.User;
import com.example.eventapp.service.ReservationService;
import com.example.eventapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;

    public ReservationController(ReservationService reservationService, UserService userService) {
        this.reservationService = reservationService;
        this.userService = userService;
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Reservation> reserve(@PathVariable("eventId") Long eventId, @AuthenticationPrincipal UserDetails principal) {
        User u = userService.findByEmail(principal.getUsername());
        Reservation r = reservationService.reserve(eventId, u);
        return ResponseEntity.ok(r);
    }
}
