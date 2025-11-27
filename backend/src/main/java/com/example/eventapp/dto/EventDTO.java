package com.example.eventapp.dto;

import java.time.LocalDateTime;

public class EventDTO {
    private Long id;
    private String title;
    private LocalDateTime startDateTime;
    private String location;
    private int seatsAvailable;
    private Double prix;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public LocalDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(LocalDateTime startDateTime) { this.startDateTime = startDateTime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public int getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }
    public Double getPrix() { return prix; }
    public void setPrix(Double prix) { this.prix = prix; }
}
