package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.model.User;
import com.example.demo.repository.EventRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Create event
    public Event createEvent(Event event) {
        // Validate organizer exists
        Optional<User> organizer = userRepository.findById(event.getOrganizerId());
        if (organizer.isEmpty()) {
            throw new RuntimeException("Organizer not found with ID: " + event.getOrganizerId());
        }
        
        // Set organizer name for easy display
        User user = organizer.get();
        event.setOrganizerName(user.getFirstName() + " " + user.getLastName());
        
        return eventRepository.save(event);
    }
    
    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    // Get by ID
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    // Get events by organizer
    public List<Event> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }
    
    // Update event
    public Event updateEvent(Long id, Event eventDetails) {
        Optional<Event> existingEvent = eventRepository.findById(id);
        if (existingEvent.isEmpty()) {
            throw new RuntimeException("Event not found with ID: " + id);
        }
        
        Event event = existingEvent.get();
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setLocation(eventDetails.getLocation());
        event.setCapacity(eventDetails.getCapacity());
        
        return eventRepository.save(event);
    }
    
    // Delete event
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with ID: " + id);
        }
        eventRepository.deleteById(id);
    }
    
    // Search events by title
    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }
    
    // Search events by location
    public List<Event> searchEventsByLocation(String location) {
        return eventRepository.findByLocationContainingIgnoreCase(location);
    }
}
