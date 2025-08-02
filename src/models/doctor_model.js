// models/doctor_model.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Using the same Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const doctorModel = {
  /**
   * Fetch available doctors based on consultation type and optional filters
   * 
   * @param {Object} params - Filter parameters
   * @param {string} params.type_id - Consultation type UUID (required)
   * @param {string} params.language - Filter by language
   * @param {string} params.mode - Filter by consultation mode (chat, voice, both)
   * @param {string} params.gender - Filter by doctor gender
   * @param {number} params.min_experience - Filter by minimum years of experience
   * @param {string} params.location - Filter by location
   * @param {boolean} params.is_active - Filter by active status (defaults to true)
   * @returns {Promise<Array>} Array of matching doctors
   */
  getAvailableDoctors: async ({ 
    type_id, 
    language, 
    mode, 
    gender,
    min_experience,
    location,
    is_active = true 
  }) => {
    try {
      // First fetch consultation type details to understand requirements
      const { data: consultationType, error: typeError } = await supabase
        .from('consultation_types')
        .select('*')
        .eq('id', type_id)
        .single();
      
      if (typeError) {
        throw new Error(`Failed to fetch consultation type: ${typeError.message}`);
      }
      
      if (!consultationType) {
        throw new Error('Consultation type not found');
      }

      // Build the base query for doctors
      let query = supabase
        .from('doctors')
        .select('id, full_name, specialty, experience_years, languages_spoken, location, consultation_mode, gender, bio, focus');
      
      // Always filter by active status
      query = query.eq('is_active', is_active);
      
      // Apply specialty filter for specialist consultations
      if (consultationType.is_specialist === true) {
        // For specialist consultations, match doctors with the relevant specialty
        query = query.eq('specialty', consultationType.name);
      }
      
      // Apply optional filters if provided
      if (language) {
        query = query.contains('languages_spoken', [language]);
      }
      
      if (mode) {
        // Mode can be 'chat', 'voice', or 'both'
        query = query.eq('consultation_mode', mode);
      }
      
      if (gender) {
        query = query.eq('gender', gender);
      }
      
      if (min_experience && !isNaN(min_experience)) {
        query = query.gte('experience_years', parseInt(min_experience));
      }
      
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      
      // Execute the query
      const { data: doctors, error: doctorsError } = await query;
      
      if (doctorsError) {
        throw new Error(`Failed to fetch doctors: ${doctorsError.message}`);
      }
      
      return doctors || [];
    } catch (error) {
      console.error('Error in getAvailableDoctors:', error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific doctor
   * 
   * @param {string} doctorId - Doctor's UUID
   * @returns {Promise<Object>} Doctor's detailed information
   */
  getDoctorDetails: async (doctorId) => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();
      
      if (error) {
        throw new Error(`Failed to fetch doctor details: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Doctor not found');
      }
      
      return data;
    } catch (error) {
      console.error('Error in getDoctorDetails:', error);
      throw error;
    }
  }
};
