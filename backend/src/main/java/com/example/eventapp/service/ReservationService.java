package com.example.eventapp.service;

import com.example.eventapp.model.Event;
import com.example.eventapp.model.Reservation;
import com.example.eventapp.model.User;
import com.example.eventapp.repository.EventRepository;
import com.example.eventapp.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository, EventRepository eventRepository, EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.eventRepository = eventRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Reservation reserve(Long eventId, User user) {
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (reservationRepository.findByEventAndUser(event, user).isPresent()) {
            throw new IllegalStateException("User already reserved this event");
        }
        if (event.getSeatsAvailable() <= 0) throw new IllegalStateException("No seats available");
        event.setSeatsAvailable(event.getSeatsAvailable() - 1);
        eventRepository.save(event);

        Reservation r = new Reservation();
        r.setEvent(event);
        r.setUser(user);
        r = reservationRepository.save(r);

        // Payment will be handled via payment endpoints (mock)

        // Send confirmation email (async in production)
        emailService.sendReservationConfirmation(user.getEmail(), event);

        return r;
    }

    @Transactional
    public Reservation confirmPayment(Long reservationId) {
        Reservation r = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));
        r.setPaid(true);
        return reservationRepository.save(r);
    }
}
