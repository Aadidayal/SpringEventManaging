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
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.title || !event.eventDate || !event.location || !event.capacity || !event.organizerId) {
      alert('Please fill all required fields');
      return;
    }
    
    // Convert capacity to number
    const eventData = {
      ...event,
      capacity: parseInt(event.capacity),
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
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  return (
    <div className="event-form-container">
      <h2>Create New Event</h2>
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
          value={event.eventDate}
          onChange={handleChange}
          disabled={loading}
          required
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
          required
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
