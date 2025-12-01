package com.example.eventapp.service;

import com.example.eventapp.model.Event;
import com.example.eventapp.model.User;
import com.example.eventapp.repository.EventRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Event create(Event event, User creator) {
        event.setCreator(creator);
        if (event.getPrix() == null) {
            event.setPrix(0.0);
        }
        if (event.getCapacity() > 0) {
            event.setSeatsAvailable(event.getCapacity());
        }
        return eventRepository.save(event);
    }

    public Event update(Long id, Event update) {
        Event e = eventRepository.findById(id).orElseThrow();
        e.setTitle(update.getTitle());
        e.setDescription(update.getDescription());
        e.setLocation(update.getLocation());
        e.setCategory(update.getCategory());
        e.setStartDateTime(update.getStartDateTime());
        
        // Gestion du prix
        if (update.getPrix() != null) {
            e.setPrix(update.getPrix());
        } else {
            e.setPrix(0.0);
        }
        
        // Gestion de la capacité
        int diff = update.getCapacity() - e.getCapacity();
        e.setCapacity(update.getCapacity());
        e.setSeatsAvailable(Math.max(0, e.getSeatsAvailable() + diff));
        
        return eventRepository.save(e);
    }

    public void delete(Long id) { eventRepository.deleteById(id); }

    public Optional<Event> findById(Long id) { return eventRepository.findById(id); }

    public List<Event> search(String category, String location, LocalDateTime from, LocalDateTime to) {
        Specification<Event> spec = Specification.where(null);
        if (category != null) spec = spec.and((root, q, cb) -> cb.equal(root.get("category"), category));
        if (location != null) spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
        if (from != null) spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("startDateTime"), from));
        if (to != null) spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("startDateTime"), to));
        return eventRepository.findAll(spec);
    }
}
