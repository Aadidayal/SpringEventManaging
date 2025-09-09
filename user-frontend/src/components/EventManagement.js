import React, { useState } from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import './EventManagement.css';

const EventManagement = () => {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'

  const handleEventCreated = () => {
    setRefresh(prev => !prev);
    setActiveTab('list'); // Switch to list view after creating
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
          />
        )}
      </div>
    </div>
  );
};

export default EventManagement;
