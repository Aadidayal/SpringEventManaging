
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false;

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
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
      const response = await axios.post(API_BASE_URL, user, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  },

  // Signup (username, email, password)
  signup: async ({ username, email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, { username, email, password });
      return response.data;
    } catch (error) {
      throw new Error('Failed to signup');
    }
  },

  // Login (email, password)
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw new Error('Failed to login');
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
