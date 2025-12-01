package com.example.eventapp.dto;

public class PaymentIntentDto {
    private String mode;
    private int amount;
    private String currency;
    private String clientSecret;
    private String status;

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public int getAmount() { return amount; }
    public void setAmount(int amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getClientSecret() { return clientSecret; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
