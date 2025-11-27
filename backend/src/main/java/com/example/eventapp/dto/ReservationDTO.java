package com.example.eventapp.dto;

public class ReservationDTO {
    private Long id;
    private EventDTO event;
    private boolean paid;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public EventDTO getEvent() { return event; }
    public void setEvent(EventDTO event) { this.event = event; }
    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
}
