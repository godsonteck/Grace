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
  priceWithContrast?: number;
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
  branchId?: string;
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
  branchId?: string;
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
  email: "gracediagnosticgh@gmail.com",
  surchargeNote: "After working hours (after 8pm), a surcharge of 70 GH₵ applies.",
  ceo: {
    name: "Mrs. Grace Mensah",
    title: "Founder & CEO",
    message: "Our commitment to 'Fast, Clear, and Accurate Images' is the heartbeat of Grace Diagnostic Centre. We believe that every patient deserves the highest standard of precision, delivered with speed and compassion, to ensure the best possible health outcomes for our community.",
    vision: "To humanize diagnostic technology and make world-class imaging accessible to all."
  }
};

export const branches: Branch[] = [
  {
    id: "accra-main",
    name: "Grace Diagnostic - Accra (Main)",
    address: "Tantra Hills Roundabout, 211 Mushroom Street",
    phone: "0555 777 333",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "ho-branch",
    name: "Grace Diagnostic - Ho",
    address: "Nyasorgbor Street, Off Trafalgar Road, Opposite Veterinary Office",
    phone: "0552 979 091",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "teshie-branch",
    name: "Grace Diagnostic - Teshie",
    address: "Near Lekma Hospital, next to Profile Pharmacy",
    phone: "0555 777 333",
    email: "gracediagnosticgh@gmail.com"
  },
  {
    id: "koforidua-branch",
    name: "Grace Diagnostic - Koforidua",
    address: "Opposite O'Green Canteen",
    phone: "0555 777 333",
    email: "gracediagnosticgh@gmail.com"
  },
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
  // CT SCANS (Ho Prices based on official list)
  { id: "ct-head-brain", name: "Head / Brain", scanTypeId: "ct-scan", category: "Head", price: 800, priceWithContrast: 1450, duration: "15 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-brain-jaw-rta-3d", name: "Brain + Jaw (RTA) 3D", scanTypeId: "ct-scan", category: "Head", price: 900, duration: "20 mins", preparation: "No special preparation." },
  { id: "ct-neck", name: "Neck", scanTypeId: "ct-scan", category: "Neck", price: 850, priceWithContrast: 1350, duration: "15 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-head-neck", name: "Head and Neck", scanTypeId: "ct-scan", category: "Head & Neck", price: 1250, priceWithContrast: 1500, duration: "25 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-sinuses-orbits", name: "Sinuses / Orbits", scanTypeId: "ct-scan", category: "Head", price: 850, priceWithContrast: 1450, duration: "15 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-chest", name: "Chest", scanTypeId: "ct-scan", category: "Torso", price: 1050, priceWithContrast: 1750, duration: "20 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-chest-abdomen", name: "Chest and Abdomen", scanTypeId: "ct-scan", category: "Torso", price: 0, priceWithContrast: 2670, duration: "30 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-abdomen-pelvis", name: "Abdomen and Pelvis", scanTypeId: "ct-scan", category: "Abdomen", price: 1250, priceWithContrast: 1980, duration: "30 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-pelvis", name: "Pelvis", scanTypeId: "ct-scan", category: "Abdomen", price: 1150, priceWithContrast: 1530, duration: "20 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-abdomen", name: "Abdomen", scanTypeId: "ct-scan", category: "Abdomen", price: 1100, priceWithContrast: 1780, duration: "20 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-abdomen-triphasic", name: "Abdomen Triphasic", scanTypeId: "ct-scan", category: "Abdomen", price: 0, priceWithContrast: 1830, duration: "40 mins", preparation: "Fast for 4 hours if contrast is required." },
  { id: "ct-cervical-spine", name: "Cervical Spine", scanTypeId: "ct-scan", category: "Spine", price: 1150, priceWithContrast: 1680, duration: "20 mins", preparation: "No metal objects." },
  { id: "ct-thoracic-spine", name: "Thoracic Spine", scanTypeId: "ct-scan", category: "Spine", price: 1150, priceWithContrast: 1680, duration: "20 mins", preparation: "No metal objects." },
  { id: "ct-lumber-spine", name: "Lumber Spine", scanTypeId: "ct-scan", category: "Spine", price: 1150, priceWithContrast: 1680, duration: "20 mins", preparation: "No metal objects." },
  { id: "ct-whole-spine", name: "Whole Spine", scanTypeId: "ct-scan", category: "Spine", price: 2800, duration: "45 mins", preparation: "No metal objects." },
  { id: "ct-ivu", name: "Intravenous Urography", scanTypeId: "ct-scan", category: "Urology", price: 0, priceWithContrast: 1880, duration: "45 mins", preparation: "Hydrate well; fasting required." },
  { id: "ct-pulmonary-angiogram", name: "Pulmonary Angiogram", scanTypeId: "ct-scan", category: "Cardiovascular", price: 0, priceWithContrast: 1800, duration: "30 mins", preparation: "Fast for 4 hours." },
  { id: "ct-extremity", name: "Knee, Thigh, Hip, Femur", scanTypeId: "ct-scan", category: "Extremities", price: 1150, priceWithContrast: 1480, duration: "20 mins", preparation: "No metal objects." },

  // ULTRASOUND (Ho Prices)
  { id: "us-pelvic", name: "Pelvic", scanTypeId: "ultrasound-scan", category: "Abdomen", price: 140, duration: "20 mins", preparation: "Full bladder required." },
  { id: "us-abdomen-pelvic", name: "Abdomen Pelvic", scanTypeId: "ultrasound-scan", category: "Abdomen", price: 200, duration: "30 mins", preparation: "Fast for 6 hours; full bladder." },
  { id: "us-neck-thyroid", name: "Neck / Thyroid", scanTypeId: "ultrasound-scan", category: "Neck", price: 200, duration: "15 mins", preparation: "No special preparation." },
  { id: "us-breast", name: "Breast (Per One)", scanTypeId: "ultrasound-scan", category: "Chest", price: 200, duration: "20 mins", preparation: "No talcum powder or deodorant." },
  { id: "us-scrotum", name: "Scrotum", scanTypeId: "ultrasound-scan", category: "Urology", price: 250, duration: "20 mins", preparation: "No special preparation." },
  { id: "us-msk", name: "MSK", scanTypeId: "ultrasound-scan", category: "Musculoskeletal", price: 250, duration: "25 mins", preparation: "No special preparation." },
  { id: "us-anomaly", name: "Anomaly", scanTypeId: "ultrasound-scan", category: "Obstetric", price: 200, duration: "45 mins", preparation: "No special preparation." },
  { id: "us-urology-prostate", name: "Urology / Prostate", scanTypeId: "ultrasound-scan", category: "Urology", price: 200, duration: "20 mins", preparation: "Full bladder required." },
  { id: "us-superficial-swelling", name: "Superficial Swelling", scanTypeId: "ultrasound-scan", category: "General", price: 200, duration: "15 mins", preparation: "No special preparation." },
  { id: "us-arterial-doppler", name: "Arterial Doppler (One Leg)", scanTypeId: "ultrasound-scan", category: "Vascular", price: 400, duration: "30 mins", preparation: "No special preparation." },
  { id: "us-venous-doppler", name: "Venous Doppler (One Leg)", scanTypeId: "ultrasound-scan", category: "Vascular", price: 300, duration: "30 mins", preparation: "No special preparation." },

  // OTHERS
  { id: "echo-standard", name: "Echo", scanTypeId: "cardiac-scan", category: "Cardiac", price: 750, duration: "30 mins", preparation: "No special preparation." },
  { id: "xr-standard", name: "X-Ray (Per Part)", scanTypeId: "xray-scan", category: "General", price: 250, duration: "5 mins", preparation: "No metal objects." },
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
