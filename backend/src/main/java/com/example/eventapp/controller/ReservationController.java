package com.example.eventapp.controller;

import com.example.eventapp.model.Reservation;
import com.example.eventapp.model.User;
import com.example.eventapp.service.ReservationService;
import com.example.eventapp.service.UserService;
import com.example.eventapp.service.PaymentService;
import com.example.eventapp.dto.PaymentIntentDto;
import com.example.eventapp.dto.PaymentConfirmationDto;
import com.example.eventapp.dto.PaymentRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;
    private final PaymentService paymentService;

    public ReservationController(ReservationService reservationService, UserService userService, PaymentService paymentService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.paymentService = paymentService;
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<Reservation> reserve(@PathVariable("eventId") Long eventId, @AuthenticationPrincipal UserDetails principal) {
        System.out.println("🎫 Reservation attempt for event: " + eventId);
        System.out.println("👤 User: " + principal.getUsername());
        System.out.println("🔐 Authorities: " + principal.getAuthorities());
        
        User u = userService.findByEmail(principal.getUsername());
        Reservation r = reservationService.reserve(eventId, u);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<PaymentIntentDto> pay(@PathVariable("id") Long id, @RequestBody(required = false) PaymentRequestDto request) {
        int amount = (request != null && request.getAmount() != null) ? request.getAmount() : 1000;
        String currency = (request != null && request.getCurrency() != null) ? request.getCurrency() : "eur";
        PaymentIntentDto intent = paymentService.createMockPaymentIntent(id, amount, currency);
        return ResponseEntity.ok(intent);
    }

    @GetMapping("/{id}/confirm")
    public ResponseEntity<PaymentConfirmationDto> confirm(@PathVariable("id") Long id, @RequestParam("paymentIntentId") String paymentIntentId) {
        PaymentConfirmationDto res = paymentService.confirmMockPaymentIntent(id, paymentIntentId);
        if ("succeeded".equals(res.getStatus())) {
            reservationService.confirmPayment(id);
        }
        return ResponseEntity.ok(res);
    }
}
