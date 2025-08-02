
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import routes from './routes/index.js';
import swaggerUiDist from 'swagger-ui-dist';

// Import Swagger documentation
import './docs/index.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Serve Swagger UI static files from node_modules
const swaggerDistDir = path.dirname(swaggerUiDist.getAbsoluteFSPath());
app.use('/swagger-ui-dist', express.static(swaggerDistDir));

// Make Swagger UI assets available at multiple paths for flexibility
app.use('/api-docs/swagger-ui-dist', express.static(swaggerDistDir));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Handle OPTIONS preflight requests
app.options('*', (req, res) => {
  res.status(200).end();
});

// Routes
app.use('/api', routes);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
  swaggerOptions: {
    url: '/api-docs.json',
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    persistAuthorization: true,
    displayRequestDuration: true,
    defaultModelsExpandDepth: 2
  }
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Health check endpoint
app.get("/", (req, res) => {
  // For API clients, return JSON
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      success: true,
      message: "Betadoc API is running",
      version: "1.0.0",
      documentation: "/api-docs",
      nodeVersion: process.version
    });
  }
  
  // For browser clients, either redirect to API docs or serve the HTML landing page
  if (req.query.docs === 'true') {
    return res.redirect('/api-docs');
  }
  
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Direct to the main Swagger UI for any alternate paths
app.get("/api-docs-fallback", (req, res) => {
  res.redirect('/api-docs');
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=== Betadoc API Server ===");
  console.log(`Server is running on port ${PORT}`);
  console.log(`Api-Docx on http://localhost:${PORT}/`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
  console.log("==========================");
});
