import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authentication error' 
    });
  }
};

// Middleware to check if user is a doctor
export const doctorOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Doctor role required.' 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authorization error' 
    });
  }
};

// Middleware to check if user is a patient
export const patientOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Patient role required.' 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authorization error' 
    });
  }
};

// Middleware to check if user is an admin
export const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Authorization error' 
    });
  }
};

// Middleware to load user profile data
export const loadUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'patient') {
      const patient = await userModel.getPatientById(userId);
      req.userProfile = patient;
    } else if (userRole === 'doctor') {
      const doctor = await userModel.getDoctorById(userId);
      req.userProfile = doctor;
    }

    next();
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: 'Error loading user profile' 
    });
  }
};
