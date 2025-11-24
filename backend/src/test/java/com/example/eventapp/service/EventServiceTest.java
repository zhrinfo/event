package com.example.eventapp.service;

import com.example.eventapp.model.Event;
import com.example.eventapp.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class EventServiceTest {
    private EventRepository eventRepository;
    private EventService eventService;

    @BeforeEach
    void setUp() {
        eventRepository = Mockito.mock(EventRepository.class);
        eventService = new EventService(eventRepository);
    }

    @Test
    void create_setsSeatsAvailable_whenCapacityProvided() {
        Event e = new Event();
        e.setTitle("Test");
        e.setCapacity(100);
        e.setStartDateTime(LocalDateTime.now().plusDays(1));

        Mockito.when(eventRepository.save(Mockito.any(Event.class))).thenAnswer(i -> i.getArgument(0));

        Event created = eventService.create(e, null);
        assertThat(created.getSeatsAvailable()).isEqualTo(100);
        assertThat(created.getTitle()).isEqualTo("Test");
    }
}
