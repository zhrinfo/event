package com.example.eventapp.controller;

import com.example.eventapp.model.Event;
import com.example.eventapp.model.User;
import com.example.eventapp.service.EventService;
import com.example.eventapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventService eventService;
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Event> create(@Valid @RequestBody Event event, @AuthenticationPrincipal UserDetails principal) {
        User u = userService.findByEmail(principal.getUsername());
        return ResponseEntity.ok(eventService.create(event, u));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable("id") Long id, @Valid @RequestBody Event event) {
        return ResponseEntity.ok(eventService.update(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> get(@PathVariable("id") Long id) {
        return eventService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Event>> search(@RequestParam(required = false) String category,
                                              @RequestParam(required = false) String location,
                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                              @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        return ResponseEntity.ok(eventService.search(category, location, from, to));
    }
}
