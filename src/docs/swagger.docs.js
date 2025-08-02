/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication operations
 *   - name: Users
 *     description: User management operations
 *   - name: Consultations
 *     description: Consultation management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone_number:
 *           type: string
 *         user_type:
 *           type: string
 *           enum: [patient]
 *     Doctor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone_number:
 *           type: string
 *         specialization:
 *           type: string
 *         qualification:
 *           type: string
 *         experience_years:
 *           type: integer
 *         bio:
 *           type: string
 *         user_type:
 *           type: string
 *           enum: [doctor]
 *     ConsultationType:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         fee:
 *           type: number
 *         doctor_earning:
 *           type: number
 *         platform_fee:
 *           type: number
 *         is_specialist:
 *           type: boolean
 *         is_follow_up:
 *           type: boolean
 */

/**
 * @swagger
 * /api/auth/patient/register:
 *   post:
 *     summary: Register a new patient
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /api/auth/doctor/register:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone_number
 *               - specialization
 *               - qualification
 *               - experience_years
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *               phone_number:
 *                 type: string
 *               specialization:
 *                 type: string
 *               qualification:
 *                 type: string
 *               experience_years:
 *                 type: number
 *               bio:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *       400:
 *         description: Bad Request
 */

/**
 * @swagger
 * /api/auth/patient/login:
 *   post:
 *     summary: Login as a patient
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/doctor/login:
 *   post:
 *     summary: Login as a doctor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/patient/profile:
 *   put:
 *     summary: Update patient profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/doctor/profile:
 *   put:
 *     summary: Update doctor profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               specialization:
 *                 type: string
 *               qualification:
 *                 type: string
 *               experience_years:
 *                 type: number
 *               bio:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/consultation-type:
 *   post:
 *     summary: Create a new consultation type
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - fee
 *               - doctor_earning
 *               - platform_fee
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               fee:
 *                 type: number
 *               doctor_earning:
 *                 type: number
 *               platform_fee:
 *                 type: number
 *               is_specialist:
 *                 type: boolean
 *               is_follow_up:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Consultation type created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/consultation-type:
 *   get:
 *     summary: Get all consultation types
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: List of consultation types
 */

/**
 * @swagger
 * /api/consultations/available-doctors:
 *   get:
 *     summary: Get available doctors for consultation
 *     tags: [Consultations]
 *     parameters:
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: string
 *         description: ID of the consultation type
 *     responses:
 *       200:
 *         description: List of available doctors
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/consultations/doctor/{doctorId}/available-slots:
 *   get:
 *     summary: Get available slots for a doctor
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for which to check availability (YYYY-MM-DD)
 *       - in: query
 *         name: consultation_type_id
 *         schema:
 *           type: string
 *         description: ID of the consultation type
 *     responses:
 *       200:
 *         description: List of available slots
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/consultations/book:
 *   post:
 *     summary: Book a consultation (legacy method)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - consultation_type
 *             properties:
 *               doctor_id:
 *                 type: string
 *               consultation_type:
 *                 type: string
 *               language:
 *                 type: string
 *               symptoms:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/book-slot:
 *   post:
 *     summary: Book a consultation with specific slot
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - consultation_type_id
 *               - slot_id
 *             properties:
 *               doctor_id:
 *                 type: string
 *               consultation_type_id:
 *                 type: string
 *               slot_id:
 *                 type: string
 *               notes:
 *                 type: string
 *               symptoms:
 *                 type: string
 *               medical_history:
 *                 type: string
 *               current_medications:
 *                 type: string
 *               allergies:
 *                 type: string
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/patient:
 *   get:
 *     summary: Get patient's consultations
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, canceled]
 *         description: Filter by consultation status
 *     responses:
 *       200:
 *         description: List of patient's consultations
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/doctor:
 *   get:
 *     summary: Get doctor's consultations
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, canceled]
 *         description: Filter by consultation status
 *     responses:
 *       200:
 *         description: List of doctor's consultations
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/consultations/{consultationId}/status:
 *   put:
 *     summary: Update consultation status
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the consultation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, canceled]
 *     responses:
 *       200:
 *         description: Consultation status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Consultation not found
 */

/**
 * @swagger
 * /api/users/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter by specialization
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *     responses:
 *       200:
 *         description: List of doctors
 */

/**
 * @swagger
 * /api/users/doctors/{id}:
 *   put:
 *     summary: Update a doctor
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               qualification:
 *                 type: string
 *               experience_years:
 *                 type: integer
 *               bio:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor details updated successfully
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /api/users/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/patients/{id}:
 *   put:
 *     summary: Update patient details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient details updated successfully
 *       404:
 *         description: Patient not found
 */
