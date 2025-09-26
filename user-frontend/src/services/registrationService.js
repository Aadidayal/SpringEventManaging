import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/registrations';

const registrationService = {
  // Register user for an event
  registerForEvent: async (eventId, userId) => {
    try {
      const response = await axios.post(API_BASE_URL, {
        eventId: eventId,
        userId: userId
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Extract error message from backend response
      const errorMessage = error.response?.data || error.message || 'Failed to register for event';
      throw new Error(errorMessage);
    }
  },

  // Cancel registration
  cancelRegistration: async (eventId, userId) => {
    try {
      const response = await axios.delete(API_BASE_URL, {
        data: {
          eventId: eventId,
          userId: userId
        },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data || error.message || 'Failed to cancel registration';
      throw new Error(errorMessage);
    }
  },

  // Get user's registrations
  getUserRegistrations: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user registrations');
    }
  },

  // Check if user is registered for event
  checkRegistration: async (eventId, userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/check`, {
        params: {
          eventId: eventId,
          userId: userId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to check registration status');
    }
  },

  // Get registration statistics for event
  getRegistrationStats: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch registration statistics');
    }
  },

  // Get all registrations for an event (for organizers)
  getEventRegistrations: async (eventId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch event registrations');
    }
  }
};

export default registrationService;