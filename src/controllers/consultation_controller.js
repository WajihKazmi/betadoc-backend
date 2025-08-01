// controllers/consultationController.js
import { consultationModel } from '../models/consultation_model.js';

export const createConsultationType = async (req, res) => {
  try {
    const { name, fee, doctor_earning, platform_fee, is_specialist, is_follow_up, description } = req.body;

    // Validate if required fields are provided
    if (!name || !fee || !doctor_earning || !platform_fee || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Insert new consultation type into the database
    const newConsultationType = await consultationModel.createConsultationType({
      name,
      fee,
      doctor_earning,
      platform_fee,
      is_specialist,
      is_follow_up,
      description
    });

    return res.status(201).json({
      success: true,
      message: 'Consultation type added successfully',
      data: newConsultationType
    });
  } catch (error) {
    console.error('Error creating consultation type:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getConsultationTypes = async (req, res) => {
  try {
    // Fetch all consultation types from the database
    const consultationTypes = await consultationModel.getConsultationTypes();

    return res.status(200).json({
      success: true,
      message: 'Consultation types fetched successfully',
      data: consultationTypes
    });
  } catch (error) {
    console.error('Error fetching consultation types:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
