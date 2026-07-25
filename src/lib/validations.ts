import { z } from 'zod';

export const AppointmentSchema = z.object({
  patientId: z.string().cuid().optional().or(z.string().min(1)),
  branchId: z.string().min(1),
  scanId: z.string().min(1),
  scanName: z.string().min(1),
  date: z.string().transform((val) => new Date(val)),
  time: z.string().min(1),
  priority: z.enum(['normal', 'urgent']).default('normal'),
  referringDoctor: z.string().optional(),
  notes: z.string().optional(),
});

export const PatientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  dob: z.string().transform((val) => new Date(val)),
  gender: z.string(),
  bloodGroup: z.string().optional(),
});

export const ReportSchema = z.object({
  appointmentId: z.string().min(1),
  patientId: z.string().min(1),
  content: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.string().length(0)),
  statFlag: z.boolean().default(false),
});
