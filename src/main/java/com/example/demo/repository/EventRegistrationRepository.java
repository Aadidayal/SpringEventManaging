package com.example.demo.repository;

import com.example.demo.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    // Find registration by event and user
    Optional<EventRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    
    // Find all registrations for an event
    List<EventRegistration> findByEventId(Long eventId);
    
    // Find all registrations by a user
    List<EventRegistration> findByUserId(Long userId);
    
    // Count registrations for an event
    long countByEventId(Long eventId);
    
    // Count confirmed registrations for an event
    long countByEventIdAndStatus(Long eventId, String status);
    
    // Check if user is registered for an event
    boolean existsByEventIdAndUserId(Long eventId, Long userId);
    
    // Find all registrations for events organized by a specific user
    @Query("SELECT er FROM EventRegistration er WHERE er.eventId IN " +
           "(SELECT e.id FROM Event e WHERE e.organizerId = :organizerId)")
    List<EventRegistration> findRegistrationsForOrganizerEvents(@Param("organizerId") Long organizerId);
}