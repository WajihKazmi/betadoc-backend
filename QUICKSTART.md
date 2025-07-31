# 🚀 Quick Start Guide - Betadoc API

Get your Betadoc API backend running in 5 minutes!

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier works)

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd beta-doc-backend
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Run the database schema:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `schema.sql`
   - Click "Run" to create all tables

### 3. Configure Environment
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration (replace with your values)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here

# JWT Configuration (generate a secure secret)
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# Optional Configuration
CORS_ORIGIN=*
LOG_LEVEL=info
```

### 4. Start the Server
```bash
npm start
```

You should see:
```
=== Betadoc API Server ===
Server is running on port 5000
Environment: development
Supabase URL: Configured
JWT Secret: Configured
==========================
```

### 5. Test the API
Visit `http://localhost:5000` in your browser or use curl:
```bash
curl http://localhost:5000
```

You should get:
```json
{
  "success": true,
  "message": "Betadoc API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🧪 Test the Authentication Endpoints

### Register a Patient
```bash
curl -X POST http://localhost:5000/api/auth/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+2348012345678",
    "language": "English",
    "referral_source": "Social Media",
    "whatsapp_opt_in": true
  }'
```

### Register a Doctor
```bash
curl -X POST http://localhost:5000/api/auth/doctor/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Dr. Jane Doe",
    "phone_number": "+2348012345679",
    "location": "Lagos, Nigeria",
    "specialty": "General Medicine",
    "experience_years": 5,
    "languages_spoken": ["English", "Yoruba"],
    "availability": {
      "monday": ["9:00-12:00", "14:00-17:00"],
      "tuesday": ["10:00-13:00"]
    },
    "bio": "Experienced doctor with a passion for preventive care.",
    "focus": "chest pain, blood pressure, diabetes, lifestyle coaching",
    "email": "jane@example.com",
    "gender": "Female",
    "mdcn_license_number": "A123456",
    "consultation_mode": "Both"
  }'
```

### Login as Patient
```bash
curl -X POST http://localhost:5000/api/auth/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+2348012345678"
  }'
```

### Get User Profile (use the token from login response)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## 🔧 Development

### Start in Development Mode
```bash
npm run dev
```

This will start the server with nodemon for automatic restarts.

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run linter (when implemented)

## 📊 Database Tables Created

The schema creates these tables:
- `patients` - Patient information
- `doctors` - Doctor profiles
- `consultations` - Medical consultations
- `payments` - Payment tracking
- `referrals` - Medical referrals
- `doctor_wallets` - Doctor earnings
- `messages_log` - Communication history
- `escalations` - Issue escalation
- `unrecognized_messages` - Unhandled messages
- `prescriptions` - Medical prescriptions
- `feedback` - Patient feedback
- `shared_links` - Referral tracking
- `consultation_types` - Consultation types with pricing

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Make sure your `.env` file exists and has all required variables
   - Check that `SUPABASE_URL` and `SUPABASE_KEY` are correct

2. **"Connection refused"**
   - Make sure Supabase is accessible
   - Check your internet connection
   - Verify your Supabase project is active

3. **"Invalid phone number format"**
   - Use international format: `+2348012345678`
   - Don't include spaces or special characters

4. **"Patient with this phone number already exists"**
   - Use a different phone number for testing
   - Or delete the existing record from Supabase

### Getting Help

- Check the full [README.md](README.md) for detailed documentation
- Review the API endpoints in the main README
- Check the server logs for error details

## 🚀 Next Steps

1. **Set up your frontend** to connect to these endpoints
2. **Implement additional features** like consultations, payments, etc.
3. **Add tests** for better code quality
4. **Deploy to production** when ready

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the server logs for error messages
3. Ensure all environment variables are set correctly
4. Verify your Supabase setup

Happy coding! 🎉 