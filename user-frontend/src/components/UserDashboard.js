import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import './UserDashboard.css';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
    
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
      setError('');
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  const handleRegister = (eventId) => {
    alert(`Registration for event ${eventId} - Feature coming soon!`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header with Logout */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <h1>🎯 Event Manager</h1>
          </div>
          <div className="user-section">
            <span className="welcome-text">
              Welcome, {user?.firstName || 'User'}!
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Discover Amazing Events</h2>
            <p>Find and register for events that interest you</p>
          </section>

          {/* Events Section */}
          <section className="events-section">
            {error && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchEvents}>Try Again</button>
              </div>
            )}

            {!error && events.length === 0 && (
              <div className="empty-state">
                <h3>No Events Available</h3>
                <p>Check back later for upcoming events!</p>
              </div>
            )}

            {!error && events.length > 0 && (
              <>
                <h3>Available Events ({events.length})</h3>
                <div className="events-grid">
                  {events.map((event) => (
                    <div key={event.id} className="event-card">
                      <div className="event-header">
                        <h4 className="event-title">{event.title}</h4>
                        <div className="event-date">
                          📅 {formatDate(event.eventDate)}
                        </div>
                      </div>
                      
                      <div className="event-body">
                        <p className="event-description">{event.description}</p>
                        
                        <div className="event-details">
                          <div className="detail-item">
                            <span className="icon">📍</span>
                            <span>{event.location}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">👥</span>
                            <span>{event.capacity} seats</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">👨‍💼</span>
                            <span>{event.organizerName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="event-footer">
                        <button 
                          className="register-btn"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;