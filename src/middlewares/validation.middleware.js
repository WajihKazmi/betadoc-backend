// Validation middleware for request validation
export const validatePatientRegistration = (req, res, next) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  // Basic phone number validation (you can enhance this)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone_number)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid phone number format'
    });
  }

  next();
};

export const validateDoctorRegistration = (req, res, next) => {
  const {
    full_name,
    phone_number,
    location,
    specialty
  } = req.body;

  const errors = [];

  if (!full_name) errors.push('Full name is required');
  if (!phone_number) errors.push('Phone number is required');
  if (!location) errors.push('Location is required');
  if (!specialty) errors.push('Specialty is required');

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
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
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