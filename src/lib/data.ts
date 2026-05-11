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
  priority?: "normal" | "urgent";
  referringDoctor?: string;
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

export const businessInfo = {
  motto: "Fast, Clear, and Accurate Images",
  contacts: ["0555 777 333", "0501 239 383"],
  email: "gracediagnosticgh@gmail.com"
};

export const branches: Branch[] = [
  { id: "ho-branch", name: "Grace Diagnostic - Ho", address: "Nyasorgbor Street, Off Trafalgar Road, Opposite Veterinary Office", phone: "0552 979 091", email: "gracediagnosticgh@gmail.com" },
  { id: "accra-main", name: "Grace Diagnostic - Accra (Main)", address: "Tantra Hills Roundabout, 211 Mushroom Street", phone: "0555 777 333", email: "gracediagnosticgh@gmail.com" },
  { id: "teshie-branch", name: "Grace Diagnostic - Teshie", address: "Near Lekma Hospital, next to Profile Pharmacy", phone: "0555 777 333", email: "gracediagnosticgh@gmail.com" },
  { id: "koforidua-branch", name: "Grace Diagnostic - Koforidua", address: "Opposite O'Green Canteen", phone: "0555 777 333", email: "gracediagnosticgh@gmail.com" },
];

export const scanTypes: ScanType[] = [
  {
    id: "ct-scan",
    name: "CT Scan",
    description: "High-speed Computed Tomography for precise diagnostic imagery.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "xray-scan",
    name: "Digital X-Ray",
    description: "Instant digital radiography with results often in less than 1 hour.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ultrasound-scan",
    name: "Ultrasound",
    description: "Advanced sonography for internal medicine and obstetric care.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "cardiac-scan",
    name: "ECG & Echo",
    description: "Comprehensive cardiac assessment including Echocardiograms and ECG.",
    image: "https://images.unsplash.com/photo-1516549119129-df1292023023?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "lab-tests",
    name: "Laboratory Tests",
    description: "Full-spectrum biochemical and clinical pathology services.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "pain-mgmt",
    name: "Pain Management",
    description: "Specialized clinical pathways for acute and chronic pain relief.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "vein-treatment",
    name: "Varicose Vein Treatment",
    description: "Non-invasive and minimally invasive vascular interventions.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
  },
];

export const bodyParts: BodyPart[] = [
  { id: "ct-brain", name: "CT Brain", scanTypeId: "ct-scan", category: "Head", price: 600, duration: "15 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "xr-chest", name: "Chest X-Ray", scanTypeId: "xray-scan", category: "Torso", price: 150, duration: "5 mins", preparation: "No metal objects or jewelry." },
  { id: "us-pelvic", name: "Pelvic Ultrasound", scanTypeId: "ultrasound-scan", category: "Lower Abdomen", price: 200, duration: "20 mins", preparation: "Drink 1L of water 1 hour before." },
  { id: "ecg-standard", name: "Standard ECG", scanTypeId: "cardiac-scan", category: "Cardiac", price: 100, duration: "10 mins", preparation: "No special preparation." },
  { id: "lab-fbc", name: "Full Blood Count", scanTypeId: "lab-tests", category: "Blood", price: 80, duration: "5 mins", preparation: "No fasting required." },
];

export const initialStaff: Staff[] = [
  { id: "st-1", name: "Dr. Samuel Mensah", role: "Radiologist", branchId: "accra-main", phone: "0555 777 333", email: "samuel@gracediagnostic.com", status: "active" },
  { id: "st-2", name: "Nurse Linda Osei", role: "Nurse", branchId: "ho-branch", phone: "0552 979 091", email: "linda@gracediagnostic.com", status: "active" },
];

export const initialEquipment: Equipment[] = [
  { id: "eq-1", name: "Siemens Somatom Go.Up", type: "CT Scanner", branchId: "accra-main", lastMaintenance: "2024-10-15", status: "operational" },
  { id: "eq-2", name: "GE Logiq E10", type: "Ultrasound", branchId: "ho-branch", lastMaintenance: "2024-11-01", status: "operational" },
];
