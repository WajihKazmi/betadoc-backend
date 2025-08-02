import fetch from 'node-fetch';

// API base URLs
const AUTH_URL = 'http://localhost:5000/api/auth';
const CONSULTATION_URL = 'http://localhost:5000/api/consultations';

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

// Test data for patients
const testPatient = {
  name: 'Test Patient',
  phone_number: '+2347099999999',
  password: 'patient123',
  email: 'test.patient@example.com',
  language: 'English',
  referral_source: 'Social Media',
  whatsapp_opt_in: true
};

// Test data for consultation types
const consultationTypes = [
  {
    name: 'General Consultation',
    fee: 1000,
    doctor_earning: 700,
    platform_fee: 300,
    is_specialist: false,
    is_follow_up: false,
    description: 'A general medical consultation for common health issues and concerns.'
  },
  {
    name: 'Specialist Consultation',
    fee: 2500,
    doctor_earning: 1800,
    platform_fee: 700,
    is_specialist: true,
    is_follow_up: false,
    description: 'A consultation with a specialist doctor for specific medical conditions.'
  },
  {
    name: 'Total Health Check',
    fee: 3500,
    doctor_earning: 2500,
    platform_fee: 1000,
    is_specialist: true,
    is_follow_up: false,
    description: 'A comprehensive health assessment including general wellness evaluation.'
  },
  {
    name: 'Follow-up Consultation',
    fee: 500,
    doctor_earning: 350,
    platform_fee: 150,
    is_specialist: false,
    is_follow_up: true,
    description: 'A follow-up appointment to review progress after an initial consultation.'
  }
];

// Helper function to make API requests
async function makeRequest(url, method, data, token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    const result = await response.json();
    return {
      status: response.status,
      data: result
    };
  } catch (error) {
    console.error(`Error making request to ${url}:`, error.message);
    return { error: error.message };
  }
}

// Log helper function
function logResult(testName, result) {
  console.log('\n' + '='.repeat(60));
  console.log(`TEST: ${testName}`);
  console.log('='.repeat(60));
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result;
}

// Test runner
async function runTests() {
  console.log('🚀 Starting BetaDoc Backend API Tests...\n');
  
  // Part 1: Register and authenticate doctors
  console.log('\n📋 PART 1: DOCTOR REGISTRATION AND AUTHENTICATION');
  
  const doctorIds = [];
  const doctorTokens = [];
  
  for (let i = 0; i < testDoctors.length; i++) {
    const doctor = testDoctors[i];
    const registerResult = await makeRequest(`${AUTH_URL}/doctor/register`, 'POST', doctor);
    logResult(`Doctor ${i+1} Registration (${doctor.full_name})`, registerResult);
    
    if (registerResult.status === 201 || registerResult.status === 200) {
      // Store doctor ID
      if (registerResult.data.data && registerResult.data.data.id) {
        doctorIds.push(registerResult.data.data.id);
      }
      
      // Login to get token
      const loginResult = await makeRequest(`${AUTH_URL}/doctor/login`, 'POST', {
        phone_number: doctor.phone_number,
        password: doctor.password
      });
      
      logResult(`Doctor ${i+1} Login (${doctor.full_name})`, loginResult);
      
      if (loginResult.status === 200 && loginResult.data.token) {
        doctorTokens.push(loginResult.data.token);
      }
    }
  }
  
  // Part 2: Register and authenticate a test patient
  console.log('\n📋 PART 2: PATIENT REGISTRATION AND AUTHENTICATION');
  
  const patientRegResult = await makeRequest(`${AUTH_URL}/patient/register`, 'POST', testPatient);
  logResult('Patient Registration', patientRegResult);
  
  let patientId = null;
  let patientToken = null;
  
  if (patientRegResult.status === 201 || patientRegResult.status === 200) {
    if (patientRegResult.data.data && patientRegResult.data.data.id) {
      patientId = patientRegResult.data.data.id;
    }
    
    const patientLoginResult = await makeRequest(`${AUTH_URL}/patient/login`, 'POST', {
      phone_number: testPatient.phone_number,
      password: testPatient.password
    });
    
    logResult('Patient Login', patientLoginResult);
    
    if (patientLoginResult.status === 200 && patientLoginResult.data.token) {
      patientToken = patientLoginResult.data.token;
    }
  }
  
  // Part 3: Create consultation types
  console.log('\n📋 PART 3: CREATING CONSULTATION TYPES');
  
  const consultationTypeIds = [];
  
  for (let i = 0; i < consultationTypes.length; i++) {
    const type = consultationTypes[i];
    const createTypeResult = await makeRequest(`${CONSULTATION_URL}/consultation-type`, 'POST', type);
    logResult(`Create Consultation Type: ${type.name}`, createTypeResult);
    
    if (createTypeResult.status === 201 && createTypeResult.data.data && createTypeResult.data.data.id) {
      consultationTypeIds.push(createTypeResult.data.data.id);
    }
  }
  
  // Part 4: Fetch all consultation types
  console.log('\n📋 PART 4: FETCHING CONSULTATION TYPES');
  
  const getTypesResult = await makeRequest(`${CONSULTATION_URL}/consultation-types`, 'GET');
  logResult('Get All Consultation Types', getTypesResult);
  
  // Part 5: Get available doctors for each consultation type
  console.log('\n📋 PART 5: FETCHING AVAILABLE DOCTORS BY CONSULTATION TYPE');
  
  const availableDoctorsMap = {};
  
  for (let i = 0; i < consultationTypeIds.length; i++) {
    const typeId = consultationTypeIds[i];
    const getDoctorsResult = await makeRequest(`${CONSULTATION_URL}/available-doctors?type_id=${typeId}`, 'GET');
    logResult(`Get Available Doctors for ${consultationTypes[i].name}`, getDoctorsResult);
    
    if (getDoctorsResult.status === 200 && getDoctorsResult.data.data) {
      availableDoctorsMap[typeId] = getDoctorsResult.data.data;
    }
  }
  
  // Part 6: Test filtering of doctors
  console.log('\n📋 PART 6: TESTING DOCTOR FILTERING');
  
  if (consultationTypeIds.length > 0) {
    // Test filtering by language
    const languageFilterResult = await makeRequest(
      `${CONSULTATION_URL}/available-doctors?type_id=${consultationTypeIds[0]}&language=English`, 
      'GET'
    );
    logResult('Filter Doctors by Language (English)', languageFilterResult);
    
    // Test filtering by gender
    const genderFilterResult = await makeRequest(
      `${CONSULTATION_URL}/available-doctors?type_id=${consultationTypeIds[0]}&gender=female`, 
      'GET'
    );
    logResult('Filter Doctors by Gender (Female)', genderFilterResult);
    
    // Test filtering by consultation mode
    const modeFilterResult = await makeRequest(
      `${CONSULTATION_URL}/available-doctors?type_id=${consultationTypeIds[0]}&mode=chat`, 
      'GET'
    );
    logResult('Filter Doctors by Consultation Mode (Chat)', modeFilterResult);
    
    // Test filtering by experience
    const experienceFilterResult = await makeRequest(
      `${CONSULTATION_URL}/available-doctors?type_id=${consultationTypeIds[0]}&min_experience=10`, 
      'GET'
    );
    logResult('Filter Doctors by Minimum Experience (10 years)', experienceFilterResult);
  }
  
  // Part 7: Book a consultation
  console.log('\n📋 PART 7: BOOKING A CONSULTATION');
  
  let bookingId = null;
  
  if (patientId && consultationTypeIds.length > 0 && availableDoctorsMap[consultationTypeIds[0]] && availableDoctorsMap[consultationTypeIds[0]].length > 0) {
    const selectedDoctorId = availableDoctorsMap[consultationTypeIds[0]][0].id;
    
    const bookingData = {
      patient_id: patientId,
      doctor_id: selectedDoctorId,
      consultation_type: consultationTypeIds[0],
      language: 'English',
      symptoms: 'Headache, fever, and general body weakness for the past 3 days.'
    };
    
    const bookConsultationResult = await makeRequest(
      `${CONSULTATION_URL}/booking`, 
      'POST', 
      bookingData,
      patientToken
    );
    
    logResult('Book Consultation', bookConsultationResult);
    
    if (bookConsultationResult.status === 201 && bookConsultationResult.data.data && bookConsultationResult.data.data.id) {
      bookingId = bookConsultationResult.data.data.id;
    }
  }
  
  // Part 8: Fetch patient consultations
  console.log('\n📋 PART 8: FETCHING PATIENT CONSULTATIONS');
  
  if (patientId) {
    const patientConsultationsResult = await makeRequest(
      `${CONSULTATION_URL}/patient/${patientId}`, 
      'GET', 
      null,
      patientToken
    );
    
    logResult('Get Patient Consultations', patientConsultationsResult);
  }
  
  // Part 9: Fetch doctor consultations
  console.log('\n📋 PART 9: FETCHING DOCTOR CONSULTATIONS');
  
  if (doctorIds.length > 0) {
    const doctorConsultationsResult = await makeRequest(
      `${CONSULTATION_URL}/doctor/${doctorIds[0]}`, 
      'GET', 
      null,
      doctorTokens[0]
    );
    
    logResult('Get Doctor Consultations', doctorConsultationsResult);
  }
  
  // Part 10: Update consultation status
  console.log('\n📋 PART 10: UPDATING CONSULTATION STATUS');
  
  if (bookingId) {
    // Update to confirmed
    const confirmResult = await makeRequest(
      `${CONSULTATION_URL}/${bookingId}/status`, 
      'PUT', 
      { status: 'confirmed' }
    );
    
    logResult('Update Consultation Status to Confirmed', confirmResult);
    
    // Update to completed
    const completeResult = await makeRequest(
      `${CONSULTATION_URL}/${bookingId}/status`, 
      'PUT', 
      { status: 'completed' }
    );
    
    logResult('Update Consultation Status to Completed', completeResult);
  }
  
  console.log('\n🏁 All tests completed!');
}

// Run all tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
