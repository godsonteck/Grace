export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface ScanType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface BodyPart {
  id: string;
  name: string;
  scanTypeId: string;
  category: string;
  price: number;
  duration: string;
  preparation: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  history?: PatientHistory[];
}

export interface PatientHistory {
  id: string;
  date: string;
  procedure: string;
  reportSummary: string;
  doctor: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  scanId: string;
  scanName: string;
  branchId: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  reportAttached?: boolean;
}

export interface Invoice {
  id: string;
  patientName: string;
  scanName: string;
  amount: number;
  date: string;
  status: "paid" | "unpaid";
  branchName: string;
}

export interface Staff {
  id: string;
  name: string;
  role: "Doctor" | "Radiologist" | "Nurse" | "Receptionist" | "Admin";
  branchId: string;
  phone: string;
  email: string;
  status: "active" | "on-leave";
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  branchId: string;
  lastMaintenance: string;
  status: "operational" | "maintenance-required" | "faulty";
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  module: string;
}

export const branches: Branch[] = [
  { id: "ho-branch", name: "Grace Diagnostic Center - Ho", address: "Ho Medical Road, Volta Region", phone: "+233 24 000 1111", email: "ho@gracediagnostic.com" },
  { id: "achimota-branch", name: "Grace Diagnostic Center - Achimota", address: "Achimota Retail Centre Plaza, Accra", phone: "+233 24 000 2222", email: "achimota@gracediagnostic.com" },
  { id: "koforidua-branch", name: "Grace Diagnostic Center - Koforidua", address: "Koforidua High St, Eastern Region", phone: "+233 24 000 3333", email: "koforidua@gracediagnostic.com" },
  { id: "tema-branch", name: "Grace Diagnostic Center - Tema", address: "Tema Community 1, Harbour City", phone: "+233 24 000 4444", email: "tema@gracediagnostic.com" },
];

export const scanTypes: ScanType[] = [
  {
    id: "ct-scan",
    name: "CT Scan",
    description: "Computed Tomography (CT) scans use X-rays and computers to produce 3D images of the inside of the body.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "xray-scan",
    name: "X-Ray",
    description: "X-rays are a type of radiation called electromagnetic waves. X-ray imaging creates pictures of the inside of your body.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ultrasound-scan",
    name: "Ultrasound",
    description: "Ultrasound (sonography) uses high-frequency sound waves to view inside the body, particularly for soft tissues and organs.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
  },
];

export const bodyParts: BodyPart[] = [
  { id: "ct-brain", name: "Brain", scanTypeId: "ct-scan", category: "Head & Neck", price: 250, duration: "15-20 mins", preparation: "Usually no special preparation required. Remove metal objects." },
  { id: "ct-chest", name: "Chest", scanTypeId: "ct-scan", category: "Torso", price: 280, duration: "20 mins", preparation: "Breathe normally. Remove jewelry." },
  { id: "xr-chest", name: "Chest PA/Lateral", scanTypeId: "xray-scan", category: "Torso", price: 80, duration: "5-10 mins", preparation: "Wear loose clothing." },
  { id: "us-abdomen", name: "Whole Abdomen", scanTypeId: "ultrasound-scan", category: "Torso", price: 120, duration: "20-30 mins", preparation: "Fasting for 8 hours." },
];

export const initialStaff: Staff[] = [
  { id: "st-1", name: "Dr. Samuel Mensah", role: "Radiologist", branchId: "achimota-branch", phone: "+233 20 111 2222", email: "samuel@gracediagnostic.com", status: "active" },
  { id: "st-2", name: "Nurse Linda Osei", role: "Nurse", branchId: "ho-branch", phone: "+233 20 333 4444", email: "linda@gracediagnostic.com", status: "active" },
  { id: "st-3", name: "Kofi Appiah", role: "Receptionist", branchId: "koforidua-branch", phone: "+233 20 555 6666", email: "kofi@gracediagnostic.com", status: "active" },
];

export const initialEquipment: Equipment[] = [
  { id: "eq-1", name: "Siemens Somatom Go.Up", type: "CT Scanner", branchId: "achimota-branch", lastMaintenance: "2024-10-15", status: "operational" },
  { id: "eq-2", name: "GE Logiq E10", type: "Ultrasound", branchId: "ho-branch", lastMaintenance: "2024-11-01", status: "operational" },
  { id: "eq-3", name: "Philips Digital Diagnost", type: "X-Ray", branchId: "tema-branch", lastMaintenance: "2024-09-20", status: "maintenance-required" },
];
