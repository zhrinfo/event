package com.example.eventapp.service;

import com.example.eventapp.dto.PaymentConfirmationDto;
import com.example.eventapp.dto.PaymentIntentDto;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    public PaymentIntentDto createMockPaymentIntent(Long reservationId, int amount, String currency) {
        String clientSecret = "mock_client_secret_" + reservationId;
        PaymentIntentDto dto = new PaymentIntentDto();
        dto.setMode("mock");
        dto.setAmount(amount);
        dto.setCurrency(currency);
        dto.setClientSecret(clientSecret);
        dto.setStatus("requires_payment_method");
        return dto;
    }

    public PaymentConfirmationDto confirmMockPaymentIntent(Long reservationId, String paymentIntentId) {
        PaymentConfirmationDto c = new PaymentConfirmationDto();
        c.setMode("mock");
        c.setReservationId(reservationId);
        String expected = "mock_client_secret_" + reservationId;
        if (expected.equals(paymentIntentId)) {
            c.setStatus("succeeded");
        } else {
            c.setStatus("requires_payment_method");
        }
        return c;
    }
}
