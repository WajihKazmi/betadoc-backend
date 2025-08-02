import fetch from 'node-fetch';

// API base URLs
const AUTH_URL = 'http://localhost:5000/api/auth';

// Test data for doctors
const testDoctors = [
  {
    full_name: 'Dr. John Smith',
    phone_number: '+2347011111111',
    password: 'doctor123',
    email: 'john.smith@example.com',
    location: 'Lagos, Nigeria',
    specialty: 'General Consultation',
    experience_years: 10,
    languages_spoken: ['English', 'Yoruba'],
    consultation_mode: 'both',
    gender: 'male',
    bio: 'Experienced general practitioner with focus on preventive care',
    focus: 'General health and wellness',
    mdcn_license_number: 'MD12345',
    mdcn_certificate_url: 'https://example.com/certificates/md12345.pdf'
  },
  {
    full_name: 'Dr. Sarah Johnson',
    phone_number: '+2347022222222',
    password: 'doctor123',
    email: 'sarah.johnson@example.com',
    location: 'Abuja, Nigeria',
    specialty: 'Specialist Consultation',
    experience_years: 8,
    languages_spoken: ['English', 'Hausa'],
    consultation_mode: 'chat',
    gender: 'female',
    bio: 'Specialist with extensive experience in chronic disease management',
    focus: 'Chronic diseases and long-term care',
    mdcn_license_number: 'MD67890',
    mdcn_certificate_url: 'https://example.com/certificates/md67890.pdf'
  },
  {
    full_name: 'Dr. Michael Adebayo',
    phone_number: '+2347033333333',
    password: 'doctor123',
    email: 'michael.adebayo@example.com',
    location: 'Port Harcourt, Nigeria',
    specialty: 'Total Health Check',
    experience_years: 15,
    languages_spoken: ['English', 'Igbo'],
    consultation_mode: 'voice',
    gender: 'male',
    bio: 'Specializing in comprehensive health assessments and preventive care',
    focus: 'Preventive medicine and health optimization',
    mdcn_license_number: 'MD54321',
    mdcn_certificate_url: 'https://example.com/certificates/md54321.pdf'
  },
  {
    full_name: 'Dr. Fatima Hassan',
    phone_number: '+2347044444444',
    password: 'doctor123',
    email: 'fatima.hassan@example.com',
    location: 'Kano, Nigeria',
    specialty: 'General Consultation',
    experience_years: 6,
    languages_spoken: ['English', 'Hausa', 'Arabic'],
    consultation_mode: 'both',
    gender: 'female',
    bio: 'Committed to providing accessible healthcare with a personal touch',
    focus: 'Family medicine and pediatric care',
    mdcn_license_number: 'MD13579',
    mdcn_certificate_url: 'https://example.com/certificates/md13579.pdf'
  },
  {
    full_name: 'Dr. Emmanuel Okafor',
    phone_number: '+2347055555555',
    password: 'doctor123',
    email: 'emmanuel.okafor@example.com',
    location: 'Enugu, Nigeria',
    specialty: 'Specialist Consultation',
    experience_years: 12,
    languages_spoken: ['English', 'Igbo'],
    consultation_mode: 'chat',
    gender: 'male',
    bio: 'Specialist focusing on chronic conditions and complex cases',
    focus: 'Specialist care and second opinions',
    mdcn_license_number: 'MD24680',
    mdcn_certificate_url: 'https://example.com/certificates/md24680.pdf'
  }
];

// Helper function to make API requests
async function makeRequest(url, method, data) {
  try {
    console.log(`\n🧪 Making ${method} request to ${url}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data, null, 2));
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error making request to ${url}:`, error.message);
    return { error: error.message };
  }
}

// Test runner for adding doctors
async function addDoctors() {
  console.log('🚀 Starting Doctor Registration Process...\n');
  
  const doctorIds = [];
  
  for (let i = 0; i < testDoctors.length; i++) {
    const doctor = testDoctors[i];
    
    console.log(`\n=${'='.repeat(50)}`);
    console.log(`REGISTERING DOCTOR ${i+1}: ${doctor.full_name}`);
    console.log(`=${'='.repeat(50)}`);
    
    const registerResult = await makeRequest(`${AUTH_URL}/doctor/register`, 'POST', doctor);
    
    if (registerResult.status === 201 || registerResult.status === 200) {
      // The doctor object is nested in data.data.doctor
      if (registerResult.data.success && registerResult.data.data && registerResult.data.data.doctor) {
        const doctorId = registerResult.data.data.doctor.id;
        doctorIds.push(doctorId);
        console.log(`✅ Successfully registered doctor: ${doctor.full_name} (ID: ${doctorId})`);
      }
    } else {
      console.log(`❌ Failed to register doctor: ${doctor.full_name}`);
    }
  }
  
  console.log('\n🏁 Doctor registration completed!');
  console.log(`Total doctors registered: ${doctorIds.length} out of ${testDoctors.length}`);
  console.log('Registered doctor IDs:', doctorIds);
}

// Run the test
addDoctors().catch(error => {
  console.error('Error running tests:', error);
});
