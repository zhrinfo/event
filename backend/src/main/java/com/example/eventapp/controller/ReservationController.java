package com.example.eventapp.controller;

import com.example.eventapp.model.Reservation;
import com.example.eventapp.model.User;
import com.example.eventapp.service.ReservationService;
import com.example.eventapp.service.UserService;
import com.example.eventapp.dto.StripePaymentRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;
    private final UserService userService;

    @Value("${stripe.api.secretKey}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public ReservationController(ReservationService reservationService, UserService userService) {
        this.reservationService = reservationService;
        this.userService = userService;
    }

    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> reserve(@PathVariable("eventId") Long eventId, @AuthenticationPrincipal UserDetails principal) {
        try {
            User u = userService.findByEmail(principal.getUsername());
            Reservation r = reservationService.reserve(eventId, u);
            return ResponseEntity.ok(r);
        } catch (IllegalStateException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/{id}/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(
            @PathVariable("id") Long reservationId,
            @RequestBody StripePaymentRequest request) {
        
        try {
            // Vérifier la réservation
            Reservation reservation = reservationService.findById(reservationId)
                    .orElseThrow(() -> new IllegalStateException("Réservation non trouvée"));
            
            // Vérifier si l'événement a un prix défini
            if (reservation.getEvent().getPrix() == null || reservation.getEvent().getPrix() <= 0) {
                throw new IllegalStateException("Le prix de l'événement n'est pas défini ou invalide");
            }
            
            // Convertir le prix en centimes (Stripe utilise les montants en centimes)
            long amountInCents = (long)(reservation.getEvent().getPrix() * 100);

            // Créer un PaymentIntent avec Stripe
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("eur") // Définir la devise en euros
                    .setPaymentMethod(request.getPaymentMethodId())
                    .setConfirm(true)
                    .setConfirmationMethod(PaymentIntentCreateParams.ConfirmationMethod.MANUAL)
                    .setReturnUrl("http://votre-frontend.com/return")
                    .putMetadata("reservation_id", reservationId.toString())
                    .setReceiptEmail(request.getCustomerEmail())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            // Mettre à jour la réservation avec l'ID de paiement
            reservation.setStripePaymentIntentId(paymentIntent.getId());
            reservationService.save(reservation);

            // Retourner le client secret
            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (StripeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<?> confirmPayment(
            @PathVariable("id") Long reservationId,
            @RequestParam String paymentIntentId) {
        
        try {
            // Vérifier le paiement avec Stripe
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
            
            if ("succeeded".equals(paymentIntent.getStatus())) {
                // Mettre à jour la réservation
                reservationService.confirmPayment(reservationId);
                
                Map<String, Object> response = new HashMap<>();
                response.put("status", "succeeded");
                response.put("reservationId", reservationId);
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("status", paymentIntent.getStatus());
                response.put("message", "Le paiement n'a pas abouti");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
