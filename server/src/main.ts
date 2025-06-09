import './config/env'
import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/index'
import { getDecisionSearchService } from './services/decisionSearchService'

const port = process.env.PORT || 5173
const app = express()

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
  const logMessage = `[Server] ${new Date().toISOString()} ${req.method} ${req.url}`;
  console.log(logMessage);
  
  // Also write to a log file
  const fs = require('fs');
  fs.appendFileSync('server.log', logMessage + '\n');
  
  next();
});

app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'govainaTG Backend' })
})

// Direct test endpoint for decision service
app.get('/test-decisions', (_req, res) => {
  try {
    const service = getDecisionSearchService();
    const status = service.getStatus();
    res.json({
      test: 'Direct endpoint',
      ...status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
})

app.use('/api', apiRouter)
app.use(errorHandler)

// Initialize services on startup
async function initializeServices() {
  try {
    console.log('[Main] Initializing decision search service...');
    const startTime = Date.now();
    
    const decisionService = getDecisionSearchService();
    await decisionService.loadDecisions();
    
    const loadTime = (Date.now() - startTime) / 1000;
    console.log(`[Main] Decision search service initialized successfully in ${loadTime}s`);
  } catch (error) {
    console.error('[Main] Failed to initialize decision search service:', error);
    console.error('[Main] The server will continue running but decision search will not be available');
  }
}

// Start http server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`)
    console.log(`CORS enabled for: ${corsOptions.origin}`)
    
    // Initialize services in background (don't await to not block server start)
    initializeServices().catch(error => {
        console.error('[Main] Service initialization error:', error);
    });
})
