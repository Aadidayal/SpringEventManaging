package com.example.demo.controller;

import com.example.demo.model.EventRegistration;
import com.example.demo.service.EventRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class EventRegistrationController {
    
    @Autowired
    private EventRegistrationService registrationService;
    
    // Register user for an event
    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Object> payload) {
        try {
            Object eventIdObj = payload.get("eventId");
            Object userIdObj = payload.get("userId");
            
            if (eventIdObj == null || userIdObj == null) {
                return new ResponseEntity<>("Event ID and User ID are required", HttpStatus.BAD_REQUEST);
            }
            
            Long eventId = Long.valueOf(eventIdObj.toString());
            Long userId = Long.valueOf(userIdObj.toString());
            
            EventRegistration registration = registrationService.registerUserForEvent(eventId, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("registration", registration);
            response.put("message", "Successfully registered for the event!");
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Cancel registration
    @DeleteMapping
    public ResponseEntity<?> cancelRegistration(@RequestBody Map<String, Object> payload) {
        try {
            Object eventIdObj = payload.get("eventId");
            Object userIdObj = payload.get("userId");
            
            if (eventIdObj == null || userIdObj == null) {
                return new ResponseEntity<>("Event ID and User ID are required", HttpStatus.BAD_REQUEST);
            }
            
            Long eventId = Long.valueOf(eventIdObj.toString());
            Long userId = Long.valueOf(userIdObj.toString());
            
            registrationService.cancelRegistration(eventId, userId);
            
            return new ResponseEntity<>("Registration cancelled successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to cancel registration", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get registrations for an event (for organizers/admins)
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventRegistration>> getEventRegistrations(@PathVariable Long eventId) {
        try {
            List<EventRegistration> registrations = registrationService.getEventRegistrations(eventId);
            return new ResponseEntity<>(registrations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get registrations by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EventRegistration>> getUserRegistrations(@PathVariable Long userId) {
        try {
            List<EventRegistration> registrations = registrationService.getUserRegistrations(userId);
            return new ResponseEntity<>(registrations, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Check if user is registered for event
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkRegistration(
            @RequestParam Long eventId, 
            @RequestParam Long userId) {
        try {
            boolean isRegistered = registrationService.isUserRegistered(eventId, userId);
            long registrationCount = registrationService.getRegistrationCount(eventId);
            int remainingCapacity = registrationService.getRemainingCapacity(eventId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isRegistered", isRegistered);
            response.put("registrationCount", registrationCount);
            response.put("remainingCapacity", remainingCapacity);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get registration statistics for event
    @GetMapping("/stats/{eventId}")
    public ResponseEntity<Map<String, Object>> getRegistrationStats(@PathVariable Long eventId) {
        try {
            long registrationCount = registrationService.getRegistrationCount(eventId);
            int remainingCapacity = registrationService.getRemainingCapacity(eventId);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalRegistrations", registrationCount);
            stats.put("remainingCapacity", remainingCapacity);
            
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}