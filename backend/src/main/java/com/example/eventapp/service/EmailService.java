package com.example.eventapp.service;

import com.example.eventapp.model.Event;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendReservationConfirmation(String to, Event event) {
        try {
            SimpleMailMessage m = new SimpleMailMessage();
            m.setTo(to);
            m.setSubject("Reservation confirmation: " + event.getTitle());
            m.setText("Votre réservation pour l'événement '" + event.getTitle() + "' est confirmée.\nDate: " + event.getStartDateTime());
            mailSender.send(m);
        } catch (Exception e) {
            // Log error in real app; swallow to keep demo simple
            System.err.println("Failed to send mail: " + e.getMessage());
        }
    }
}
