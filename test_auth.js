// Simple test script to verify authentication endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testPatient = {
  phone_number: '+1234567890',
  password: 'testpassword123',
  email: 'test.patient@example.com',
  language: 'English',
  referral_source: 'Online',
  whatsapp_opt_in: true
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
  consultation_mode: 'Both'
};

async function testEndpoint(endpoint, method, data) {
  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}`);
    console.log('Request data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message);
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication API Tests...\n');

  // Test 1: Patient Registration
  console.log('='.repeat(50));
  console.log('TEST 1: Patient Registration');
  console.log('='.repeat(50));
  const patientRegResult = await testEndpoint('/patient/register', 'POST', testPatient);

  // Test 2: Patient Login
  console.log('\n' + '='.repeat(50));
  console.log('TEST 2: Patient Login with Phone');
  console.log('='.repeat(50));
  const patientLoginResult = await testEndpoint('/patient/login', 'POST', {
    phone_number: testPatient.phone_number,
    password: testPatient.password
  });

  // Test 3: Patient Login with Email
  console.log('\n' + '='.repeat(50));
  console.log('TEST 3: Patient Login with Email');
  console.log('='.repeat(50));
  const patientEmailLoginResult = await testEndpoint('/patient/login', 'POST', {
    email: testPatient.email,
    password: testPatient.password
  });

  // Test 4: Doctor Registration
  console.log('\n' + '='.repeat(50));
  console.log('TEST 4: Doctor Registration');
  console.log('='.repeat(50));
  const doctorRegResult = await testEndpoint('/doctor/register', 'POST', testDoctor);

  // Test 5: Doctor Login
  console.log('\n' + '='.repeat(50));
  console.log('TEST 5: Doctor Login with Phone');
  console.log('='.repeat(50));
  const doctorLoginResult = await testEndpoint('/doctor/login', 'POST', {
    phone_number: testDoctor.phone_number,
    password: testDoctor.password
  });

  // Test 6: Invalid Login
  console.log('\n' + '='.repeat(50));
  console.log('TEST 6: Invalid Login (Wrong Password)');
  console.log('='.repeat(50));
  const invalidLoginResult = await testEndpoint('/patient/login', 'POST', {
    phone_number: testPatient.phone_number,
    password: 'wrongpassword'
  });

  // Test 7: Missing Password
  console.log('\n' + '='.repeat(50));
  console.log('TEST 7: Login without Password');
  console.log('='.repeat(50));
  const noPasswordResult = await testEndpoint('/patient/login', 'POST', {
    phone_number: testPatient.phone_number
  });

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Tests Completed!');
  console.log('='.repeat(50));
}

// Run tests
runTests().catch(console.error);
