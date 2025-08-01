import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper functions for user operations
export const userModel = {
  // Find user by phone number
  findByPhone: async (phoneNumber) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Find doctor by phone number
  findDoctorByPhone: async (phoneNumber) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('phone_number', phoneNumber)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Find patient by email
  findPatientByEmail: async (email) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Find doctor by email
  findDoctorByEmail: async (email) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Find patient by username (if username field exists)
  findPatientByUsername: async (username) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Find doctor by username (if username field exists)
  findDoctorByUsername: async (username) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data;
  },

  // Check if patient exists by phone or email
  checkPatientExists: async (phone_number, email) => {
    let query = supabase.from('patients').select('id, phone_number, email');
    
    if (phone_number && email) {
      query = query.or(`phone_number.eq.${phone_number},email.eq.${email}`);
    } else if (phone_number) {
      query = query.eq('phone_number', phone_number);
    } else if (email) {
      query = query.eq('email', email);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  },

  // Check if doctor exists by phone or email
  checkDoctorExists: async (phone_number, email) => {
    let query = supabase.from('doctors').select('id, phone_number, email');
    
    if (phone_number && email) {
      query = query.or(`phone_number.eq.${phone_number},email.eq.${email}`);
    } else if (phone_number) {
      query = query.eq('phone_number', phone_number);
    } else if (email) {
      query = query.eq('email', email);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data && data.length > 0 ? data[0] : null;
  },

  // Create new patient
  createPatient: async (patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new doctor
  createDoctor: async (doctorData) => {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctorData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update patient
  updatePatient: async (id, updateData) => {
    const { data, error } = await supabase
      .from('patients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update doctor
  updateDoctor: async (id, updateData) => {
    const { data, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get patient by ID
  getPatientById: async (id) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
