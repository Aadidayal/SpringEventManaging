import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
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
