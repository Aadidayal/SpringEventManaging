import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import eventService from '../services/eventService';
import './EventForm.css';

const EventForm = ({ onEventCreated, loading }) => {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    capacity: '',
    organizerId: ''
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState('');

  // Get minimum datetime (current date + 1 hour buffer)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1); // Add 1 hour buffer
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  // Validate event date
  const validateEventDate = (dateTimeString) => {
    if (!dateTimeString) return 'Event date and time are required';
    
    const selectedDate = new Date(dateTimeString);
    const now = new Date();
    
    if (selectedDate <= now) {
      return 'Event date and time must be in the future';
    }
    
    // Optional: Check if it's too far in the future (e.g., 2 years)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    if (selectedDate > twoYearsFromNow) {
      return 'Event date cannot be more than 2 years in the future';
    }
    
    return null; // No error
  };

  // Fetch users for organizer dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous error when user starts typing
    if (error) setError('');
    
    // Special validation for eventDate
    if (name === 'eventDate') {
      const dateError = validateEventDate(value);
      if (dateError) {
        setError(dateError);
      }
    }
    
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    // Basic required field validation
    if (!event.title || !event.eventDate || !event.location || !event.capacity || !event.organizerId) {
      setError('Please fill all required fields');
      return;
    }
    
    // Validate event date
    const dateError = validateEventDate(event.eventDate);
    if (dateError) {
      setError(dateError);
      return;
    }
    
    // Validate capacity is a positive number
    const capacity = parseInt(event.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      setError('Event capacity must be a positive number');
      return;
    }
    
    if (capacity > 10000) {
      setError('Event capacity cannot exceed 10,000 participants');
      return;
    }
    
    // Convert capacity to number
    const eventData = {
      ...event,
      capacity: capacity,
      organizerId: parseInt(event.organizerId)
    };
    
    try {
      await onEventCreated(eventData);
      
      // Reset form only after successful creation
      setEvent({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        capacity: '',
        organizerId: ''
      });
      setError(''); // Clear error on success
    } catch (error) {
      console.error('Error in form submission:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    }
  };

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          name="title"
          placeholder="Event Title *"
          value={event.title}
          onChange={handleChange}
          disabled={loading}
          required
        />
        
        <textarea
          name="description"
          placeholder="Event Description"
          value={event.description}
          onChange={handleChange}
          disabled={loading}
          rows="3"
        />
        
        <input
          type="datetime-local"
          name="eventDate"
          placeholder="Event Date & Time *"
          value={event.eventDate}
          onChange={handleChange}
          disabled={loading}
          min={getMinDateTime()}
          required
          title="Event must be scheduled for a future date and time"
        />
        
        <input
          type="text"
          name="location"
          placeholder="Location *"
          value={event.location}
          onChange={handleChange}
          disabled={loading}
          required
        />
        
        <input
          type="number"
          name="capacity"
          placeholder="Capacity *"
          value={event.capacity}
          onChange={handleChange}
          disabled={loading}
          min="1"
          max="10000"
          required
          title="Enter the maximum number of participants (1-10,000)"
        />
        
        <select
          name="organizerId"
          value={event.organizerId}
          onChange={handleChange}
          disabled={loading || loadingUsers}
          required
        >
          <option value="">Select Organizer *</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
        
        <button type="submit" disabled={loading || loadingUsers} className="submit-btn">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
