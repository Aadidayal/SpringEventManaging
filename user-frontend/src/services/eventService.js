import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/events';

const eventService = {
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch event');
    }
  },

  // Get events by organizer
  getEventsByOrganizer: async (organizerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organizer/${organizerId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch events by organizer');
    }
  },

  // Create new event
  createEvent: async (event) => {
    try {
      const response = await axios.post(API_BASE_URL, event, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      // Extract error message from backend response
      const errorMessage = error.response?.data || error.message || 'Failed to create event';
      throw new Error(errorMessage);
    }
  },

  // Update event
  updateEvent: async (id, event) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, event);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update event');
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete event');
    }
  },

  // Search events by title
  searchEventsByTitle: async (title) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/title/${title}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search events by title');
    }
  },

  // Search events by location
  searchEventsByLocation: async (location) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/location/${location}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to search events by location');
    }
  }
};

export default eventService;
