# Betadoc API Backend

A comprehensive healthcare platform API built with Node.js, Express, and Supabase for managing patients, doctors, consultations, and medical services.

## 🚀 Features

- **Patient Management**: Registration, profile management, and consultation history
- **Doctor Management**: Registration, profile management, availability tracking
- **Authentication**: JWT-based authentication with refresh tokens
- **Consultation System**: Booking, tracking, and managing medical consultations
- **Payment Integration**: Payment tracking and verification
- **Referral System**: Medical referrals and prescriptions
- **Real-time Messaging**: Message logging and escalation handling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project
- Environment variables configured

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beta-doc-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   
   # CORS Configuration
   CORS_ORIGIN=*
   
   # Optional Configuration
   LOG_LEVEL=info
   MAX_FILE_SIZE=10mb
   ```

4. **Set up Supabase Database**
   Run the provided SQL schema in your Supabase SQL editor:
   ```sql
   -- Copy and paste the schema from the schema.sql file
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Authentication Endpoints

#### Patient Registration
```http
POST /api/auth/patient/register
Content-Type: application/json

{
  "phone_number": "+2348012345678",
  "language": "English",
  "referral_source": "Social Media",
  "whatsapp_opt_in": true
}
```

#### Doctor Registration
```http
POST /api/auth/doctor/register
Content-Type: application/json

{
  "full_name": "Dr. Jane Doe",
  "phone_number": "+2348012345678",
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
  "mdcn_certificate_url": "https://example.com/certificates/jane.pdf",
  "consultation_mode": "Both"
}
```

#### Patient Login
```http
POST /api/auth/patient/login
Content-Type: application/json

{
  "phone_number": "+2348012345678"
}
```

#### Doctor Login
```http
POST /api/auth/doctor/login
Content-Type: application/json

{
  "phone_number": "+2348012345678"
}
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Update Patient Profile
```http
PUT /api/auth/patient/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "language": "Yoruba",
  "referral_source": "Friend",
  "whatsapp_opt_in": false
}
```

#### Update Doctor Profile
```http
PUT /api/auth/doctor/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "full_name": "Dr. Jane Smith",
  "location": "Abuja, Nigeria",
  "specialty": "Pediatrics",
  "experience_years": 6,
  "bio": "Updated bio information"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your_refresh_token"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Structure
- **Access Token**: Valid for 7 days (configurable)
- **Refresh Token**: Valid for 30 days (configurable)

### Role-Based Access
- `patient`: Access to patient-specific endpoints
- `doctor`: Access to doctor-specific endpoints
- `admin`: Access to admin endpoints (future implementation)

## 📊 Database Schema

The application uses the following main tables:

1. **patients** - Patient information and preferences
2. **doctors** - Doctor profiles and credentials
3. **consultations** - Medical consultation records
4. **payments** - Payment tracking and verification
5. **referrals** - Medical referrals and prescriptions
6. **doctor_wallets** - Doctor earnings and payouts
7. **messages_log** - Communication history
8. **escalations** - Issue escalation tracking
9. **unrecognized_messages** - Unhandled message tracking
10. **prescriptions** - Medical prescriptions
11. **feedback** - Patient feedback and ratings
12. **shared_links** - Referral link tracking

## 🛡️ Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Rate limiting (configurable)
- Environment variable validation

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment | development | No |
| `SUPABASE_URL` | Supabase project URL | - | Yes |
| `SUPABASE_KEY` | Supabase anon key | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret | JWT_SECRET | No |
| `CORS_ORIGIN` | CORS origin | * | No |

## 🚀 Deployment

### Production Deployment

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   PORT=5000
   SUPABASE_URL=your_production_supabase_url
   SUPABASE_KEY=your_production_supabase_key
   JWT_SECRET=your_secure_jwt_secret
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 📈 Monitoring and Logging

The application includes:
- Request logging
- Error tracking
- Performance monitoring
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Patient and doctor authentication
- Profile management
- Basic consultation system
- Payment tracking
- Referral system 