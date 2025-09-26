package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.EventRegistration;
import com.example.demo.model.User;
import com.example.demo.repository.EventRegistrationRepository;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventRegistrationService {
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Register user for an event
    public EventRegistration registerUserForEvent(Long eventId, Long userId) {
        // Check if event exists
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            throw new RuntimeException("Event not found with ID: " + eventId);
        }
        
        // Check if user exists
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        Event event = eventOpt.get();
        User user = userOpt.get();
        
        // Check if event is in the future
        if (event.getEventDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot register for past events");
        }
        
        // Check if user is already registered
        if (registrationRepository.existsByEventIdAndUserId(eventId, userId)) {
            throw new RuntimeException("User is already registered for this event");
        }
        
        // Check if event has capacity
        long currentRegistrations = registrationRepository.countByEventIdAndStatus(eventId, "CONFIRMED");
        if (currentRegistrations >= event.getCapacity()) {
            throw new RuntimeException("Event is at full capacity");
        }
        
        // Check if user is trying to register for their own event
        if (event.getOrganizerId().equals(userId)) {
            throw new RuntimeException("Organizers cannot register for their own events");
        }
        
        // Create registration
        EventRegistration registration = new EventRegistration();
        registration.setEventId(eventId);
        registration.setUserId(userId);
        registration.setStatus("CONFIRMED");
        registration.setUserName(user.getFirstName() + " " + user.getLastName());
        registration.setUserEmail(user.getEmail());
        registration.setEventTitle(event.getTitle());
        
        return registrationRepository.save(registration);
    }
    
    // Cancel registration
    public void cancelRegistration(Long eventId, Long userId) {
        Optional<EventRegistration> registrationOpt = 
            registrationRepository.findByEventIdAndUserId(eventId, userId);
            
        if (registrationOpt.isEmpty()) {
            throw new RuntimeException("No registration found for this user and event");
        }
        
        EventRegistration registration = registrationOpt.get();
        
        // Check if event is in the future
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isPresent() && eventOpt.get().getEventDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot cancel registration for past events");
        }
        
        registration.setStatus("CANCELLED");
        registrationRepository.save(registration);
    }
    
    // Get all registrations for an event
    public List<EventRegistration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
    
    // Get all registrations by a user
    public List<EventRegistration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }
    
    // Check if user is registered for event
    public boolean isUserRegistered(Long eventId, Long userId) {
        return registrationRepository.existsByEventIdAndUserId(eventId, userId);
    }
    
    // Get registration count for event
    public long getRegistrationCount(Long eventId) {
        return registrationRepository.countByEventIdAndStatus(eventId, "CONFIRMED");
    }
    
    // Get remaining capacity for event
    public int getRemainingCapacity(Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty()) {
            return 0;
        }
        
        Event event = eventOpt.get();
        long registrations = registrationRepository.countByEventIdAndStatus(eventId, "CONFIRMED");
        return Math.max(0, event.getCapacity() - (int) registrations);
    }
    
    // Get registrations for events organized by a user (for admin dashboard)
    public List<EventRegistration> getRegistrationsForOrganizerEvents(Long organizerId) {
        return registrationRepository.findRegistrationsForOrganizerEvents(organizerId);
    }
}