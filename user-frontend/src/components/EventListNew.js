import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import userService from '../services/userService';
import EventEditModal from './EventEditModal';
import './EventList.css';

const EventList = ({ refresh, setRefresh }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, [refresh]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const eventData = await eventService.getAllEvents();
      setEvents(eventData);
    } catch (error) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const userData = await userService.getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getOrganizerName = (organizerId) => {
    const organizer = users.find(user => user.id === organizerId);
    return organizer ? `${organizer.firstName} ${organizer.lastName}` : 'Unknown';
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
        if (setRefresh) setRefresh(prev => !prev);
      } catch (error) {
        alert('Failed to delete event');
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      setUpdating(true);
      await eventService.updateEvent(eventId, eventData);
      await fetchEvents(); // Refresh the list
      setEditingEvent(null);
      if (setRefresh) setRefresh(prev => !prev);
    } catch (error) {
      alert('Failed to update event');
      console.error('Error updating event:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Events List ({events.length})</h2>
        <button onClick={fetchEvents} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {events.length === 0 ? (
        <div className="no-events">
          <p>No events found.</p>
          <p>Create some events or check if Spring Boot is running on port 8080.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-id">ID: {event.id}</span>
              </div>
              
              <div className="event-info">
                <div className="event-description">
                  {event.description || 'No description provided'}
                </div>
                
                <div className="event-details">
                  <div className="event-detail">
                    <strong>Date:</strong> {formatDate(event.eventDate)}
                  </div>
                  <div className="event-detail">
                    <strong>Location:</strong> {event.location}
                  </div>
                  <div className="event-detail">
                    <strong>Capacity:</strong> {event.capacity} people
                  </div>
                  <div className="event-detail">
                    <strong>Organizer:</strong> {getOrganizerName(event.organizerId)}
                  </div>
                </div>
              </div>
              
              <div className="event-actions">
                <button 
                  onClick={() => handleEditEvent(event)}
                  className="edit-btn"
                  disabled={updating}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="delete-btn"
                  disabled={updating}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {editingEvent && (
        <EventEditModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={handleUpdateEvent}
          loading={updating}
        />
      )}
    </div>
  );
};

export default EventList;
