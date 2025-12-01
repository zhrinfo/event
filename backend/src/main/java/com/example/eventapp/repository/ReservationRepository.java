package com.example.eventapp.repository;

import com.example.eventapp.model.Reservation;
import com.example.eventapp.model.Event;
import com.example.eventapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByEventAndUser(Event event, User user);
    List<Reservation> findByUser(User user);
    long countByEvent(Event event);
}
