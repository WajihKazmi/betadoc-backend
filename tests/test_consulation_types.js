import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/';  // Your API base URL

// Test data
const testPatient = {
  phone_number: '+1234567890',
  password: 'testpassword123',
  email: 'test.patient@example.com',
  language: 'English',
  referral_source: 'Online',
  whatsapp_opt_in: true,
  name: 'Test Patient',
};

const testDoctor = {
  full_name: 'Dr. Test Doctor',
  phone_number: '+1987654321',
  password: 'doctorpassword123',
  email: 'test.doctor@example.com',
  location: 'Lagos, Nigeria',
  specialty: 'General Medicine',
  experience_years: 5,
  languages_spoken: ['English'],
  consultation_mode: 'both'
};

// Function to log in and get the token
async function loginAndGetToken() {
  try {
    console.log(`🧪 Logging in with patient credentials...`);
    const response = await fetch(`${BASE_URL}auth/patient/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testPatient.email,
        password: testPatient.password
      })
    });

    const result = await response.json();
    if (response.status === 200 && result.success) {
      console.log('Login successful! Access token:', result.data.access_token);
      return result.data.access_token;  // Return the token for future requests
    } else {
      console.error('Login failed:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
}

// Function to test adding consultation types
async function testAddConsultationTypes(token) {
  const consultationTypes = [
    { name: 'General Consultation', fee: 900, doctor_earning: 500, platform_fee: 400, is_specialist: false, is_follow_up: false, description: 'Basic consultation' },
    { name: 'Total Health Check', fee: 3000, doctor_earning: 2000, platform_fee: 1000, is_specialist: false, is_follow_up: false, description: 'Full medical checkup' },
    { name: 'Specialist Consultation', fee: 5000, doctor_earning: 3500, platform_fee: 1500, is_specialist: true, is_follow_up: false, description: 'Consultation with a specialist' },
    { name: 'Follow-Up Consultation', fee: 1000, doctor_earning: 650, platform_fee: 250, is_specialist: false, is_follow_up: true, description: 'Follow-up consultation after treatment' }
  ];

  for (const consultation of consultationTypes) {
    try {
      console.log(`🧪 Testing POST /consultations/consultation-type with ${consultation.name}`);
      const response = await fetch(`${BASE_URL}consultations/consultation-type`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use the token in Authorization header
        },
        body: JSON.stringify(consultation)
      });

      const result = await response.json();
      if (response.status === 201 && result.success) {
        console.log(`Success adding ${consultation.name}:`, result.data);
      } else {
        console.error(`Error adding ${consultation.name}:`, result.message);
      }
    } catch (error) {
      console.error('Error during consultation type creation:', error);
    }
  }
}

// Function to get all consultation types
async function testGetConsultationTypes(token) {
  try {
    console.log(`🧪 Testing GET /consultations/consultation-types`);
    const response = await fetch(`${BASE_URL}consultations/consultation-types`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // Use the token in Authorization header
      }
    });

    const result = await response.json();
    if (response.status === 200 && result.success) {
      console.log('Fetched consultation types:', result.data);
    } else {
      console.error('Error fetching consultation types:', result.message);
    }
  } catch (error) {
    console.error('Error during fetching consultation types:', error);
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting Consultation Type API Tests...\n');

  // Step 1: Login and get the token
  const token = await loginAndGetToken();

  if (token) {
    // Step 2: If token is valid, run the tests
    console.log('\n' + '='.repeat(50));
    console.log('TEST 1: Add Consultation Types');
    console.log('=' .repeat(50));
    await testAddConsultationTypes(token);

    console.log('\n' + '='.repeat(50));
    console.log('TEST 2: Get All Consultation Types');
    console.log('=' .repeat(50));
    await testGetConsultationTypes(token);
  } else {
    console.error('Login failed, skipping tests.');
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Tests Completed!');
  console.log('='.repeat(50));
}

// Run tests
runTests().catch(console.error);
