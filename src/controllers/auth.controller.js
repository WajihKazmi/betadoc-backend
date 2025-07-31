import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d' 
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { 
    expiresIn: '30d' 
  });
};

// Patient Registration
export const registerPatient = async (req, res) => {
  try {
    const {
      phone_number,
      language = 'English',
      referral_source,
      whatsapp_opt_in = true
    } = req.body;

    // Validate required fields
    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Check if patient already exists
    const existingPatient = await userModel.findByPhone(phone_number);
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this phone number already exists'
      });
    }

    // Create new patient
    const patientData = {
      phone_number,
      language,
      referral_source,
      whatsapp_opt_in,
      created_at: new Date().toISOString()
    };

    const newPatient = await userModel.createPatient(patientData);

    // Generate token
    const token = generateToken({
      id: newPatient.id,
      role: 'patient',
      phone_number: newPatient.phone_number
    });

    const refreshToken = generateRefreshToken({
      id: newPatient.id,
      role: 'patient'
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: {
        patient: newPatient,
        access_token: token,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Doctor Registration
export const registerDoctor = async (req, res) => {
  try {
    const {
      full_name,
      phone_number,
      location,
      specialty,
      experience_years,
      languages_spoken = [],
      availability = {},
      bio,
      focus,
      email,
      gender,
      mdcn_license_number,
      mdcn_certificate_url,
      consultation_mode = 'Both'
    } = req.body;

    // Validate required fields
    if (!full_name || !phone_number || !location || !specialty) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone number, location, and specialty are required'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await userModel.findDoctorByPhone(phone_number);
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this phone number already exists'
      });
    }

    // Create new doctor
    const doctorData = {
      full_name,
      phone_number,
      location,
      specialty,
      experience_years,
      languages_spoken,
      availability,
      bio,
      focus,
      email,
      gender,
      mdcn_license_number,
      mdcn_certificate_url,
      consultation_mode,
      is_active: true,
      created_at: new Date().toISOString()
    };

    const newDoctor = await userModel.createDoctor(doctorData);

    // Generate token
    const token = generateToken({
      id: newDoctor.id,
      role: 'doctor',
      phone_number: newDoctor.phone_number
    });

    const refreshToken = generateRefreshToken({
      id: newDoctor.id,
      role: 'doctor'
    });

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      data: {
        doctor: newDoctor,
        access_token: token,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Patient Login
export const loginPatient = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Find patient
    const patient = await userModel.findByPhone(phone_number);
    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Update last seen
    await userModel.updatePatient(patient.id, {
      last_seen: new Date().toISOString()
    });

    // Generate token
    const token = generateToken({
      id: patient.id,
      role: 'patient',
      phone_number: patient.phone_number
    });

    const refreshToken = generateRefreshToken({
      id: patient.id,
      role: 'patient'
    });

    res.json({
      success: true,
      message: 'Patient logged in successfully',
      data: {
        patient,
        access_token: token,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Doctor Login
export const loginDoctor = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    // Find doctor
    const doctor = await userModel.findDoctorByPhone(phone_number);
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Check if doctor is active
    if (!doctor.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate token
    const token = generateToken({
      id: doctor.id,
      role: 'doctor',
      phone_number: doctor.phone_number
    });

    const refreshToken = generateRefreshToken({
      id: doctor.id,
      role: 'doctor'
    });

    res.json({
      success: true,
      message: 'Doctor logged in successfully',
      data: {
        doctor,
        access_token: token,
        refresh_token: refreshToken
      }
    });

  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let userProfile;
    if (userRole === 'patient') {
      userProfile = await userModel.getPatientById(userId);
    } else if (userRole === 'doctor') {
      userProfile = await userModel.getDoctorById(userId);
    }

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: userProfile,
        role: userRole
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      language,
      referral_source,
      whatsapp_opt_in
    } = req.body;

    const updateData = {};
    if (language !== undefined) updateData.language = language;
    if (referral_source !== undefined) updateData.referral_source = referral_source;
    if (whatsapp_opt_in !== undefined) updateData.whatsapp_opt_in = whatsapp_opt_in;

    const updatedPatient = await userModel.updatePatient(userId, updateData);

    res.json({
      success: true,
      message: 'Patient profile updated successfully',
      data: updatedPatient
    });

  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update doctor profile
export const updateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      location,
      specialty,
      experience_years,
      languages_spoken,
      availability,
      bio,
      focus,
      email,
      gender,
      mdcn_license_number,
      mdcn_certificate_url,
      consultation_mode
    } = req.body;

    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (location !== undefined) updateData.location = location;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (experience_years !== undefined) updateData.experience_years = experience_years;
    if (languages_spoken !== undefined) updateData.languages_spoken = languages_spoken;
    if (availability !== undefined) updateData.availability = availability;
    if (bio !== undefined) updateData.bio = bio;
    if (focus !== undefined) updateData.focus = focus;
    if (email !== undefined) updateData.email = email;
    if (gender !== undefined) updateData.gender = gender;
    if (mdcn_license_number !== undefined) updateData.mdcn_license_number = mdcn_license_number;
    if (mdcn_certificate_url !== undefined) updateData.mdcn_certificate_url = mdcn_certificate_url;
    if (consultation_mode !== undefined) updateData.consultation_mode = consultation_mode;

    const updatedDoctor = await userModel.updateDoctor(userId, updateData);

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updatedDoctor
    });

  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      
      // Generate new tokens
      const newToken = generateToken({
        id: decoded.id,
        role: decoded.role,
        phone_number: decoded.phone_number
      });

      const newRefreshToken = generateRefreshToken({
        id: decoded.id,
        role: decoded.role
      });

      res.json({
        success: true,
        data: {
          access_token: newToken,
          refresh_token: newRefreshToken
        }
      });

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Logout (client-side token removal)
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
