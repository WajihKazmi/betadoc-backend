// Validation middleware for request validation
export const validatePatientRegistration = (req, res, next) => {
  const { phone_number, password } = req.body;

  const errors = [];

  if (!phone_number) errors.push('Phone number is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Basic phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  next();
};

export const validateDoctorRegistration = (req, res, next) => {
  const {
    full_name,
    phone_number,
    location,
    specialty,
    password
  } = req.body;

  const errors = [];

  if (!full_name) errors.push('Full name is required');
  if (!phone_number) errors.push('Phone number is required');
  if (!location) errors.push('Location is required');
  if (!specialty) errors.push('Specialty is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Email validation if provided
  if (req.body.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { phone_number, email, username, password } = req.body;

  const errors = [];

  // At least one identifier is required
  if (!phone_number && !email && !username) {
    errors.push('Phone number, email, or username is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Validate phone number format if provided
  if (phone_number) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }
  }

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  }

  next();
};

export const validateRefreshToken = (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  next();
}; 