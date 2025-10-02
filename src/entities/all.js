// src/entities/all.js - API-based entities
const API_BASE_URL = '/api'; // Use the Vite proxy

const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  console.log('🔍 Making API request to:', `${API_BASE_URL}${endpoint}`);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Get the raw response text first
    const responseText = await response.text();
    console.log('📥 Raw response status:', response.status);
    console.log('📥 Raw response text:', responseText);
    
    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('❌ Response was:', responseText);
      throw new Error(`Backend returned invalid JSON. Status: ${response.status}. Response: ${responseText.substring(0, 200)}...`);
    }
    
    if (!response.ok) {
      console.error('❌ API Error:', responseData);
      throw new Error(responseData.message || `Request failed with status ${response.status}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('❌ API Request Failed:', {endpoint, error: error.message});
    throw error;
  }
};

// Lead API
export const Lead = {
  list: async (sort = '-createdAt', limit = 50) => { // Added sort and limit parameters
    return apiRequest(`/leads?sort=${sort}&limit=${limit}`);
  },
  
  create: async (leadData) => {
    return apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },
  
  update: async (id, leadData) => {
    return apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
  
  getById: async (id) => {
    return apiRequest(`/leads/${id}`);
  },
};

// Activity API
export const Activity = {
  list: async (sort = '-createdAt', limit = 50) => { // Added sort and limit parameters
    return apiRequest(`/activities?sort=${sort}&limit=${limit}`);
  },
  
  create: async (activityData) => {
    return apiRequest('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },
  
  update: async (id, activityData) => {
    return apiRequest(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/activities/${id}`, {
      method: 'DELETE',
    });
  },
  
  getByLeadId: async (leadId) => {
    return apiRequest(`/activities/lead/${leadId}`);
  },
};

// Auth API
export const AuthAPI = {
  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    // The backend response already has success: true and the user object
    return response; 
  },
  
  register: async (name, email, password) => { // Corrected parameters for register
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },
  
  logout: () => {
    removeAuthToken();
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Add a way to get the current authenticated user's data from the backend
  getMe: async () => {
    return apiRequest('/auth/me', { method: 'GET' });
  }
};

// Add AIAPI for integrations
export const AIAPI = {
  analyzeLead: async (leadId, leadData, activities = []) => {
    return apiRequest(`/ai/analyze-lead/${leadId}`, {
      method: 'POST',
      body: JSON.stringify({ leadData, activities }),
    });
  },
  scoreLead: async (leadData) => {
    // The fix is here: send leadData directly, not nested.
    return apiRequest('/ai/score-lead', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },
  generateEmail: async (leadData, activities = []) => {
    return apiRequest('/ai/generate-email', {
      method: 'POST',
      body: JSON.stringify({ leadData, activities }),
    });
  }
};