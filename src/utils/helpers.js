// Helper utility functions

// Format phone number to international format
export const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with country code
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.substring(1);
  }
  
  // If it doesn't start with +, add it
  if (!phone.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// Validate phone number format
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
export const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format response
export const formatResponse = (success, message, data = null, errors = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) response.data = data;
  if (errors !== null) response.errors = errors;
  
  return response;
};

// Sanitize user data (remove sensitive fields)
export const sanitizeUserData = (user) => {
  if (!user) return null;
  
  const { password_hash, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Parse availability JSON
export const parseAvailability = (availability) => {
  if (typeof availability === 'string') {
    try {
      return JSON.parse(availability);
    } catch (error) {
      return {};
    }
  }
  return availability || {};
};

// Validate availability format
export const validateAvailability = (availability) => {
  if (!availability || typeof availability !== 'object') {
    return false;
  }
  
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const [day, slots] of Object.entries(availability)) {
    if (!validDays.includes(day.toLowerCase())) {
      return false;
    }
    
    if (!Array.isArray(slots)) {
      return false;
    }
    
    // Validate time slot format (HH:MM-HH:MM)
    for (const slot of slots) {
      if (typeof slot !== 'string' || !/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(slot)) {
        return false;
      }
    }
  }
  
  return true;
};

// Get current timestamp
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}; 