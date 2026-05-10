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
  centralContact: ["0555 777 333", "0501 239 383"],
  email: "gracediagnosticgh@gmail.com",
};

export const branches: Branch[] = [
  {
    id: "accra-main",
    name: "Grace Diagnostic Center - Accra (Main)",
    address: "Tantra Hills Roundabout, 211 Mushroom Street",
    phone: "0555 777 333",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "ho-branch",
    name: "Grace Diagnostic Center - Ho",
    address: "Nyasorgbor Street, Off Trafalgar Road, Opposite Veterinary Office",
    phone: "0552 979 091",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "teshie-branch",
    name: "Grace Diagnostic Center - Teshie",
    address: "Near Lekma Hospital, next to Profile Pharmacy",
    phone: "0501 239 383",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "koforidua-branch",
    name: "Grace Diagnostic Center - Koforidua",
    address: "Opposite O'Green Canteen",
    phone: "0555 777 333",
    email: "gracediagnosticgh@gmail.com"
  },
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
    name: "Digital X-Ray",
    description: "Digital X-rays create detailed pictures of the inside of your body with minimal radiation exposure.",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ultrasound-scan",
    name: "Ultrasound",
    description: "Ultrasound uses high-frequency sound waves to view inside the body, particularly for soft tissues and organs.",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "ecg-scan",
    name: "ECG",
    description: "Electrocardiogram (ECG) records the electrical signal from your heart to check for different heart conditions.",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "echo-scan",
    name: "Echocardiogram",
    description: "An echocardiogram uses sound waves to produce images of your heart.",
    image: "https://images.unsplash.com/photo-1579154235602-3c2c299e0af3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "lab-tests",
    name: "Laboratory Tests",
    description: "Comprehensive blood, urine, and other lab tests to help diagnose and monitor various health conditions.",
    image: "https://images.unsplash.com/photo-1579154235602-3c2c299e0af3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "pain-mgmt",
    name: "Pain Management",
    description: "Specialized treatments to reduce chronic or acute pain and improve quality of life.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "varicose-vein",
    name: "Varicose Vein Treatment",
    description: "Advanced procedures to treat enlarged, twisted veins, typically in the legs.",
    image: "https://images.unsplash.com/photo-1559839734-2b71f1e3c77d?auto=format&fit=crop&q=80&w=800",
  },
];

export const bodyParts: BodyPart[] = [
  { id: "ct-brain", name: "Brain", scanTypeId: "ct-scan", category: "Head & Neck", price: 250, duration: "15-20 mins", preparation: "Usually no special preparation required. Remove metal objects." },
  { id: "ct-chest", name: "Chest", scanTypeId: "ct-scan", category: "Torso", price: 280, duration: "20 mins", preparation: "Breathe normally. Remove jewelry." },
  { id: "xr-chest", name: "Chest PA/Lateral", scanTypeId: "xray-scan", category: "Torso", price: 80, duration: "5-10 mins", preparation: "Wear loose clothing." },
  { id: "us-abdomen", name: "Whole Abdomen", scanTypeId: "ultrasound-scan", category: "Torso", price: 120, duration: "20-30 mins", preparation: "Fasting for 8 hours." },
  { id: "ecg-standard", name: "Standard 12-Lead", scanTypeId: "ecg-scan", category: "Cardiology", price: 150, duration: "10-15 mins", preparation: "None." },
  { id: "echo-heart", name: "Transthoracic Echo", scanTypeId: "echo-scan", category: "Cardiology", price: 350, duration: "30-45 mins", preparation: "None." },
  { id: "lab-cbc", name: "Complete Blood Count", scanTypeId: "lab-tests", category: "Laboratory", price: 50, duration: "5 mins", preparation: "Fasting might be required." },
];

export const initialStaff: Staff[] = [
  { id: "st-1", name: "Dr. Samuel Mensah", role: "Radiologist", branchId: "accra-main", phone: "0555 777 333", email: "gracediagnosticgh@gmail.com", status: "active" },
  { id: "st-2", name: "Nurse Linda Osei", role: "Nurse", branchId: "ho-branch", phone: "0552 979 091", email: "gracediagnosticgh@gmail.com", status: "active" },
  { id: "st-3", name: "Kofi Appiah", role: "Receptionist", branchId: "koforidua-branch", phone: "0555 777 333", email: "gracediagnosticgh@gmail.com", status: "active" },
];

export const initialEquipment: Equipment[] = [
  { id: "eq-1", name: "Siemens Somatom Go.Up", type: "CT Scanner", branchId: "accra-main", lastMaintenance: "2024-10-15", status: "operational" },
  { id: "eq-2", name: "GE Logiq E10", type: "Ultrasound", branchId: "ho-branch", lastMaintenance: "2024-11-01", status: "operational" },
  { id: "eq-3", name: "Philips Digital Diagnost", type: "X-Ray", branchId: "teshie-branch", lastMaintenance: "2024-09-20", status: "operational" },
];
