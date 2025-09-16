package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.service.EventService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/events")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    // Helper method to check if user is admin
    private boolean isAdmin(Long userId) {
        try {
            Optional<User> userOpt = userService.getUserById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return user.getEmail().toLowerCase().contains("admin") || 
                       user.getFirstName().toLowerCase().equals("admin");
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
    
    // Create - Only admins can create events
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        try {
            // Extract organizer ID from payload to check admin status
            Object organizerIdObj = payload.get("organizerId");
            if (organizerIdObj == null) {
                return new ResponseEntity<>("Organizer ID is required", HttpStatus.BAD_REQUEST);
            }
            
            Long organizerId = Long.valueOf(organizerIdObj.toString());
            
            // Check if the organizer is an admin
            if (!isAdmin(organizerId)) {
                return new ResponseEntity<>("Only admin users can create events", HttpStatus.FORBIDDEN);
            }
            
            // Validate required fields
            if (payload.get("title") == null || payload.get("title").toString().trim().isEmpty()) {
                return new ResponseEntity<>("Event title is required", HttpStatus.BAD_REQUEST);
            }
            
            if (payload.get("eventDate") == null || payload.get("eventDate").toString().trim().isEmpty()) {
                return new ResponseEntity<>("Event date is required", HttpStatus.BAD_REQUEST);
            }
            
            if (payload.get("location") == null || payload.get("location").toString().trim().isEmpty()) {
                return new ResponseEntity<>("Event location is required", HttpStatus.BAD_REQUEST);
            }
            
            if (payload.get("capacity") == null) {
                return new ResponseEntity<>("Event capacity is required", HttpStatus.BAD_REQUEST);
            }
            
            // Create event object from payload
            Event event = new Event();
            event.setTitle(payload.get("title").toString().trim());
            event.setDescription(payload.get("description") != null ? payload.get("description").toString().trim() : "");
            
            // Parse and validate the datetime
            String dateTimeStr = payload.get("eventDate").toString();
            LocalDateTime eventDateTime;
            try {
                eventDateTime = LocalDateTime.parse(dateTimeStr);
            } catch (Exception e) {
                return new ResponseEntity<>("Invalid date format. Please use YYYY-MM-DDTHH:MM format", HttpStatus.BAD_REQUEST);
            }
            
            // Validate that event is in the future
            LocalDateTime now = LocalDateTime.now();
            if (eventDateTime.isBefore(now) || eventDateTime.isEqual(now)) {
                return new ResponseEntity<>("Event date and time must be in the future", HttpStatus.BAD_REQUEST);
            }
            
            // Validate that event is not too far in the future (2 years)
            LocalDateTime twoYearsFromNow = now.plusYears(2);
            if (eventDateTime.isAfter(twoYearsFromNow)) {
                return new ResponseEntity<>("Event date cannot be more than 2 years in the future", HttpStatus.BAD_REQUEST);
            }
            
            event.setEventDate(eventDateTime);
            event.setLocation(payload.get("location").toString().trim());
            
            // Validate and set capacity
            Integer capacity;
            try {
                capacity = Integer.valueOf(payload.get("capacity").toString());
                if (capacity <= 0) {
                    return new ResponseEntity<>("Event capacity must be a positive number", HttpStatus.BAD_REQUEST);
                }
                if (capacity > 10000) {
                    return new ResponseEntity<>("Event capacity cannot exceed 10,000 participants", HttpStatus.BAD_REQUEST);
                }
            } catch (NumberFormatException e) {
                return new ResponseEntity<>("Invalid capacity format. Must be a number", HttpStatus.BAD_REQUEST);
            }
            
            event.setCapacity(capacity);
            event.setOrganizerId(organizerId);
            
            // Set organizer name for easy display
            Optional<User> organizerOpt = userService.getUserById(organizerId);
            if (organizerOpt.isPresent()) {
                User organizer = organizerOpt.get();
                event.setOrganizerName(organizer.getFirstName() + " " + organizer.getLastName());
            }
            
            Event createdEvent = eventService.createEvent(event);
            return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid number format in request data", HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Failed to create event: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred while creating the event", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // Get 
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    //  ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        if (event.isPresent()) {
            return new ResponseEntity<>(event.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    //  organizer
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable Long organizerId) {
        List<Event> events = eventService.getEventsByOrganizer(organizerId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        try {
            Event updatedEvent = eventService.updateEvent(id, eventDetails);
            return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete 
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // S title
    @GetMapping("/search/title/{title}")
    public ResponseEntity<List<Event>> searchEventsByTitle(@PathVariable String title) {
        List<Event> events = eventService.searchEventsByTitle(title);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
    
    //  S location
    @GetMapping("/search/location/{location}")
    public ResponseEntity<List<Event>> searchEventsByLocation(@PathVariable String location) {
        List<Event> events = eventService.searchEventsByLocation(location);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
