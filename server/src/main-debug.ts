import './config/env'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/index'
import { getDecisionSearchService } from './services/decisionSearchService'
import fs from 'fs'
import path from 'path'

const port = process.env.PORT || 5173
const app = express()

// Create logs directory
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Simple file logger
const logFile = path.join(logsDir, `server-${new Date().toISOString().split('T')[0]}.log`);
function log(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
  
  // Always write to console
  process.stdout.write(logEntry);
  
  // Also write to file
  fs.appendFileSync(logFile, logEntry);
}

// Log startup
log('INFO', '=== Server Starting ===');
log('INFO', `Node version: ${process.version}`);
log('INFO', `Process ID: ${process.pid}`);
log('INFO', `Log file: ${logFile}`);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey'],
}

// Request logging middleware
app.use((req, _res, next) => {
  log('REQUEST', `${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body
  });
  next();
});

app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  log('INFO', 'Health check requested');
  res.json({ status: 'ok', service: 'govainaTG Backend', pid: process.pid })
})

// Direct test endpoint for decision service
app.get('/test-decisions', (_req, res) => {
  log('INFO', 'Test decisions endpoint called');
  try {
    const service = getDecisionSearchService();
    const status = service.getStatus();
    log('INFO', 'Decision service status', status);
    res.json({
      test: 'Direct endpoint',
      ...status
    });
  } catch (error) {
    log('ERROR', 'Test decisions failed', error);
    res.status(500).json({ error: 'Failed' });
  }
})

// Add specific endpoint for decision search status
app.get('/api/decisions/status', (_req, res) => {
  log('INFO', 'Decision status endpoint called');
  try {
    const service = getDecisionSearchService();
    const status = service.getStatus();
    res.json(status);
  } catch (error) {
    log('ERROR', 'Decision status failed', error);
    res.status(500).json({ error: 'Service not initialized' });
  }
});

app.use('/api', apiRouter)
app.use(errorHandler)

// Initialize services on startup
async function initializeServices() {
  try {
    log('INFO', 'Initializing decision search service...');
    const startTime = Date.now();
    
    const decisionService = getDecisionSearchService();
    await decisionService.loadDecisions();
    
    const loadTime = (Date.now() - startTime) / 1000;
    const status = decisionService.getStatus();
    log('INFO', `Decision search service initialized in ${loadTime}s`, status);
    
    // Force flush stdout
    if (process.stdout.write) {
      process.stdout.write('\n');
    }
  } catch (error) {
    log('ERROR', 'Failed to initialize decision search service', error);
  }
}

// Start http server
app.listen(port, async () => {
    log('INFO', `Server is running on port ${port}`);
    log('INFO', `CORS enabled for: ${JSON.stringify(corsOptions.origin)}`);
    log('INFO', `Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize services in background
    initializeServices().catch(error => {
        log('ERROR', 'Service initialization error', error);
    });
})

// Handle process events
process.on('uncaughtException', (error) => {
  log('ERROR', 'Uncaught exception', error);
});

process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', 'Unhandled rejection', { reason, promise });
});

process.on('SIGINT', () => {
  log('INFO', 'Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('INFO', 'Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});
