import React, { useState, useEffect } from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import eventService from '../services/eventService';
import './EventManagement.css';

const EventManagement = () => {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get user info and check admin status
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const userData = JSON.parse(authUser);
      setUser(userData);
      
      // Check if user is admin
      const adminStatus = userData.email?.toLowerCase().includes('admin') || 
                         userData.firstName?.toLowerCase() === 'admin';
      setIsAdmin(adminStatus);
    }
  }, []);

  // If not admin, show access denied message
  if (!isAdmin) {
    return (
      <div className="event-management">
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>🚫 Access Denied</h2>
            <p>Only administrators can manage events.</p>
            <p>Please contact your administrator for access.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleEventCreated = async (eventData) => {
    try {
      setLoading(true);
      await eventService.createEvent(eventData);
      setRefresh(prev => !prev);
      setActiveTab('list'); // Switch to list view after creating
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      // Re-throw the error so EventForm can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-management">
      <div className="management-header">
        <h1>Event Management System</h1>
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 View Events
          </button>
          <button 
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ➕ Create Event
          </button>
        </div>
      </div>

      <div className="management-content">
        {activeTab === 'list' && (
          <EventList 
            refresh={refresh} 
            setRefresh={setRefresh}
          />
        )}
        
        {activeTab === 'create' && (
          <EventForm 
            onEventCreated={handleEventCreated}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default EventManagement;
