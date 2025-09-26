package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "event_id", nullable = false)
    private Long eventId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private LocalDateTime registrationDate;
    
    @Column(length = 20, nullable = false)
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED, PENDING
    
    // Optional: Store user and event info for easy access
    @Column(name = "user_name")
    private String userName;
    
    @Column(name = "user_email")
    private String userEmail;
    
    @Column(name = "event_title")
    private String eventTitle;
    
    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
    }
}