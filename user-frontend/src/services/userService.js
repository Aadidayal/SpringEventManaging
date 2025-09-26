
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false;

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  },

  // Get user by email
  getUserByEmail: async (email) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user by email');
    }
  },

  // Create new user
  createUser: async (user) => {
    try {
      const response = await axios.post(API_BASE_URL, user);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  // Signup (firstName, lastName, email, password)
  signup: async ({ firstName, lastName, email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, { firstName, lastName, email, password });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      
      // Handle different types of error responses
      let errorMessage = 'Failed to signup';
      
      if (error.response) {
        const data = error.response.data;
        
        // If it's a string message
        if (typeof data === 'string') {
          errorMessage = data;
        }
        // If it's an object with validation errors
        else if (typeof data === 'object' && data !== null) {
          if (data.message) {
            errorMessage = data.message;
          } else if (Object.keys(data).length > 0) {
            // Handle validation errors object - show all errors
            const errors = Object.entries(data).map(([field, message]) => `${field}: ${message}`);
            errorMessage = errors.join(', ');
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  // Login (email, password)
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      // Extract the error message from the backend response
      const errorMessage = error.response?.data || error.message || 'Failed to login';
      throw new Error(errorMessage);
    }
  },

  // Update user
  updateUser: async (id, user) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      return true;
    } catch (error) {
      throw new Error('Failed to delete user');
    }
  }
};

export default userService;
