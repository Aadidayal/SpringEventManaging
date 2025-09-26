import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import './UserDashboard.css';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({});
  const [registering, setRegistering] = useState({});
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [activeSection, setActiveSection] = useState('all-events'); // 'all-events' or 'my-registrations'

  useEffect(() => {
    // Get user info from localStorage
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setUser(JSON.parse(authUser));
    }
    
    fetchEvents();
  }, []);

  useEffect(() => {
    if (user && events.length > 0) {
      checkRegistrationStatus();
    }
  }, [user, events]);

  useEffect(() => {
    if (user) {
      fetchMyRegistrations();
    }
  }, [user]);

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

  const checkRegistrationStatus = async () => {
    if (!user) return;
    
    const statusMap = {};
    for (const event of events) {
      try {
        const status = await registrationService.checkRegistration(event.id, user.id);
        statusMap[event.id] = status;
      } catch (error) {
        console.error(`Error checking registration for event ${event.id}:`, error);
      }
    }
    setRegistrationStatus(statusMap);
  };

  const fetchMyRegistrations = async () => {
    if (!user) return;
    
    try {
      const registrations = await registrationService.getUserRegistrations(user.id);
      
      // Get full event details for each registration
      const registrationsWithEvents = await Promise.all(
        registrations.map(async (registration) => {
          try {
            const event = await eventService.getEventById(registration.eventId);
            return {
              ...registration,
              event: event
            };
          } catch (error) {
            console.error(`Error fetching event ${registration.eventId}:`, error);
            return {
              ...registration,
              event: null
            };
          }
        })
      );
      
      // Filter out registrations where event couldn't be loaded and only show confirmed ones
      const validRegistrations = registrationsWithEvents.filter(
        reg => reg.event && reg.status === 'CONFIRMED'
      );
      
      setMyRegistrations(validRegistrations);
    } catch (error) {
      console.error('Error fetching my registrations:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    window.location.href = '/login';
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      alert('Please login to register for events');
      return;
    }

    setRegistering(prev => ({ ...prev, [eventId]: true }));

    try {
      const result = await registrationService.registerForEvent(eventId, user.id);
      
      // Update registration status
      setRegistrationStatus(prev => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          isRegistered: true,
          registrationCount: (prev[eventId]?.registrationCount || 0) + 1,
          remainingCapacity: Math.max(0, (prev[eventId]?.remainingCapacity || 0) - 1)
        }
      }));

      alert(result.message || 'Successfully registered for the event!');
      
      // Refresh my registrations
      fetchMyRegistrations();
    } catch (error) {
      alert(error.message || 'Failed to register for the event');
    } finally {
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (!user) return;

    if (!window.confirm('Are you sure you want to cancel your registration?')) {
      return;
    }

    setRegistering(prev => ({ ...prev, [eventId]: true }));

    try {
      await registrationService.cancelRegistration(eventId, user.id);
      
      // Update registration status
      setRegistrationStatus(prev => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          isRegistered: false,
          registrationCount: Math.max(0, (prev[eventId]?.registrationCount || 0) - 1),
          remainingCapacity: (prev[eventId]?.remainingCapacity || 0) + 1
        }
      }));

      alert('Registration cancelled successfully');
      
      // Refresh my registrations
      fetchMyRegistrations();
    } catch (error) {
      alert(error.message || 'Failed to cancel registration');
    } finally {
      setRegistering(prev => ({ ...prev, [eventId]: false }));
    }
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

          {/* Section Toggle */}
          <div className="section-toggle">
            <button 
              className={`toggle-btn ${activeSection === 'all-events' ? 'active' : ''}`}
              onClick={() => setActiveSection('all-events')}
            >
              All Events ({events.length})
            </button>
            <button 
              className={`toggle-btn ${activeSection === 'my-registrations' ? 'active' : ''}`}
              onClick={() => setActiveSection('my-registrations')}
            >
              My Registrations ({myRegistrations.length})
            </button>
          </div>

          {/* My Registrations Section */}
          {activeSection === 'my-registrations' && (
            <section className="my-registrations-section">
              <h3>My Registered Events</h3>
              
              {myRegistrations.length === 0 ? (
                <div className="empty-registrations">
                  <h4>No Registered Events</h4>
                  <p>You haven't registered for any events yet. Browse available events and register for the ones that interest you!</p>
                </div>
              ) : (
                <div className="registered-events-grid">
                  {myRegistrations.map((registration) => (
                    <div key={registration.id} className="registered-event-card">
                      <div className="registration-info">
                        <div className="registration-date">
                          ✅ Registered on {formatDate(registration.registrationDate)}
                        </div>
                      </div>
                      
                      <div className="event-header">
                        <h4 className="event-title">{registration.event.title}</h4>
                        <div className="event-date">
                          📅 {formatDate(registration.event.eventDate)}
                        </div>
                      </div>
                      
                      <div className="event-body">
                        <p className="event-description">{registration.event.description}</p>
                        
                        <div className="event-details">
                          <div className="detail-item">
                            <span className="icon">📍</span>
                            <span>{registration.event.location}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">👥</span>
                            <span>
                              {registrationStatus[registration.event.id] 
                                ? `${registrationStatus[registration.event.id].registrationCount}/${registration.event.capacity} registered`
                                : `${registration.event.capacity} seats`}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">👨‍💼</span>
                            <span>{registration.event.organizerName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="event-footer">
                        <button 
                          className="cancel-btn"
                          onClick={() => handleCancelRegistration(registration.event.id)}
                          disabled={registering[registration.event.id] || new Date(registration.event.eventDate) < new Date()}
                        >
                          {registering[registration.event.id] 
                            ? 'Cancelling...' 
                            : new Date(registration.event.eventDate) < new Date()
                              ? 'Event Passed'
                              : 'Cancel Registration'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* All Events Section */}
          {activeSection === 'all-events' && (
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
                            <span>
                              {registrationStatus[event.id] 
                                ? `${registrationStatus[event.id].registrationCount}/${event.capacity} registered`
                                : `${event.capacity} seats`}
                            </span>
                          </div>
                          {registrationStatus[event.id] && registrationStatus[event.id].remainingCapacity <= 5 && (
                            <div className="detail-item capacity-warning">
                              <span className="icon">⚠️</span>
                              <span>Only {registrationStatus[event.id].remainingCapacity} spots left!</span>
                            </div>
                          )}
                          <div className="detail-item">
                            <span className="icon">👨‍💼</span>
                            <span>{event.organizerName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="event-footer">
                        {/* Show registration status */}
                        {registrationStatus[event.id] && registrationStatus[event.id].isRegistered ? (
                          <div className="registration-status">
                            <div className="registered-badge">✅ You're registered!</div>
                            <button 
                              className="cancel-btn"
                              onClick={() => handleCancelRegistration(event.id)}
                              disabled={registering[event.id]}
                            >
                              {registering[event.id] ? 'Cancelling...' : 'Cancel Registration'}
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="register-btn"
                            onClick={() => handleRegister(event.id)}
                            disabled={
                              registering[event.id] || 
                              (registrationStatus[event.id] && registrationStatus[event.id].remainingCapacity === 0) ||
                              (event.organizerId === user?.id)
                            }
                          >
                            {registering[event.id] 
                              ? 'Registering...' 
                              : registrationStatus[event.id] && registrationStatus[event.id].remainingCapacity === 0 
                                ? 'Event Full' 
                                : event.organizerId === user?.id
                                  ? 'Your Event'
                                  : 'Register Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;