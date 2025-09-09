import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import './EventEditModal.css';

const EventEditModal = ({ event, onClose, onUpdate, loading }) => {
  const [editEvent, setEditEvent] = useState({
    title: event.title,
    description: event.description || '',
    eventDate: event.eventDate ? event.eventDate.slice(0, 16) : '', // Format for datetime-local
    location: event.location,
    capacity: event.capacity.toString(),
    organizerId: event.organizerId.toString()
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
    setEditEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editEvent.title || !editEvent.eventDate || !editEvent.location || !editEvent.capacity || !editEvent.organizerId) {
      alert('Please fill all required fields');
      return;
    }
    
    // Convert capacity to number
    const eventData = {
      ...editEvent,
      capacity: parseInt(editEvent.capacity),
      organizerId: parseInt(editEvent.organizerId)
    };
    
    onUpdate(event.id, eventData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Event</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              name="title"
              value={editEvent.title}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={editEvent.description}
              onChange={handleChange}
              disabled={loading}
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Event Date & Time *</label>
            <input
              type="datetime-local"
              name="eventDate"
              value={editEvent.eventDate}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={editEvent.location}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Capacity *</label>
            <input
              type="number"
              name="capacity"
              value={editEvent.capacity}
              onChange={handleChange}
              disabled={loading}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Organizer *</label>
            <select
              name="organizerId"
              value={editEvent.organizerId}
              onChange={handleChange}
              disabled={loading || loadingUsers}
              required
            >
              <option value="">Select Organizer</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={loading || loadingUsers}>
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventEditModal;
