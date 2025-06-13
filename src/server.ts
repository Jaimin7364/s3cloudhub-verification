import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { Certificate, VerificationRequest, VerificationResponse } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Load certificates data
const loadCertificates = (): Certificate[] => {
  try {
    const certsPath = path.join(__dirname, '../data/certs.json');
    const certsData = fs.readFileSync(certsPath, 'utf8');
    return JSON.parse(certsData);
  } catch (error) {
    console.error('Error loading certificates:', error);
    return [];
  }
};

// API Routes
app.post('/api/verify', (req: Request<{}, VerificationResponse, VerificationRequest>, res: Response<VerificationResponse>) => {
  try {
    const { name, startDate } = req.body;

    // Validate input
    if (!name || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Name and start date are required'
      });
    }

    // Load certificates
    const certificates = loadCertificates();

    // Find matching certificate
    const certificate = certificates.find(cert => 
      cert.name.toLowerCase() === name.toLowerCase() && 
      cert.startDate === startDate
    );

    if (certificate) {
      res.json({
        success: true,
        certificate
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve frontend pages
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/verify.html', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/verify.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 S3CloudHub Verification Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
});

export default app;