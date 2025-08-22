import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req: Request, _: Response, next: Function) => {
  const timestamp = new Date().toISOString();
  // Corrected log message to match the bonus feature description
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Interfaces (These should be in src/interfaces/index.ts as you provided, so we'll remove them from here to avoid duplication)
/*
interface CreateCompanyRequest {
  name: string;
  registrationNumber: string;
}

interface CreateServiceRequest {
  name: string;
  description: string;
  price: number;
  companyId: string;
}
*/
import { CreateCompanyRequest, CreateServiceRequest } from './interfaces';

// Routes

// POST /companies - Create a new company
app.post('/companies', [
  body('name').notEmpty().withMessage('Name is required'),
  body('registrationNumber').notEmpty().withMessage('Registration number is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, registrationNumber }: CreateCompanyRequest = req.body;

    // Check for existing company by registration number
    const existingCompany = await prisma.company.findUnique({
      where: { registrationNumber },
    });
    if (existingCompany) {
      return res.status(409).json({
        error: 'Registration number already exists'
      });
    }

    const company = await prisma.company.create({
      data: { name, registrationNumber },
      include: { services: true }
    });

    return res.status(201).json(company);
  } catch (error: any) {
    // Catch-all for other potential errors
    console.error('Error creating company:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /companies - List all companies with their services
app.get('/companies', async (_: Request, res: Response) => {
  try {
    const companies = await prisma.company.findMany({
      include: { services: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /services - Create a service under a company
app.post('/services', [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('companyId').notEmpty().withMessage('Company ID is required')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, companyId }: CreateServiceRequest = req.body;

    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        companyId
      }
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /services/:id - Get service details by ID
app.get('/services/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Service ID is required' });
      }

      const service = await prisma.service.findUnique({
        where: { id },
        include: { company: true }
      });

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      return res.json(service);
    } catch (error) {
      console.error('Error fetching service:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


// Health check endpoint
app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});