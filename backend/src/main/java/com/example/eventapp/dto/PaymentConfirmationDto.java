package com.example.eventapp.dto;

public class PaymentConfirmationDto {
    private String mode;
    private Long reservationId;
    private String status;

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
