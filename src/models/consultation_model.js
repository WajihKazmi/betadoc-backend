// models/consultationModel.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const consultationModel = {
  // Create a new consultation type
  createConsultationType: async ({ name, fee, doctor_earning, platform_fee, is_specialist, is_follow_up, description }) => {
    const { data, error } = await supabase
      .from('consultation_types')
      .insert([
        {
          name,
          fee,
          doctor_earning,
          platform_fee,
          is_specialist,
          is_follow_up,
          description
        }
      ])
      .single(); // Get the inserted row

    if (error) {
      throw new Error('Failed to create consultation type: ' + error.message);
    }

    return data;
  },

  // Get all consultation types
  getConsultationTypes: async () => {
    const { data, error } = await supabase
      .from('consultation_types')
      .select('*');

    if (error) {
      throw new Error('Failed to fetch consultation types: ' + error.message);
    }

    return data;
  }
};
