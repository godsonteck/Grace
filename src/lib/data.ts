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
  price?: number;
  duration?: string;
  preparation?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
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

export const branches: Branch[] = [
  {
    id: "ho-branch",
    name: "Grace Diagnostic Center - Ho",
    address: "Ho Medical Road, Volta Region",
    phone: "+233 24 000 1111",
    email: "ho@gracediagnostic.com",
  },
  {
    id: "achimota-branch",
    name: "Grace Diagnostic Center - Achimota",
    address: "Achimota Retail Centre Plaza, Accra",
    phone: "+233 24 000 2222",
    email: "achimota@gracediagnostic.com",
  },
  {
    id: "koforidua-branch",
    name: "Grace Diagnostic Center - Koforidua",
    address: "Koforidua High St, Eastern Region",
    phone: "+233 24 000 3333",
    email: "koforidua@gracediagnostic.com",
  },
  {
    id: "tema-branch",
    name: "Grace Diagnostic Center - Tema",
    address: "Tema Community 1, Harbour City",
    phone: "+233 24 000 4444",
    email: "tema@gracediagnostic.com",
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
  // CT Scans
  {
    id: "ct-brain",
    name: "Brain",
    scanTypeId: "ct-scan",
    category: "Head & Neck",
    price: 250,
    duration: "15-20 mins",
    preparation: "Usually no special preparation required. Remove metal objects."
  },
  {
    id: "ct-neck",
    name: "Neck",
    scanTypeId: "ct-scan",
    category: "Head & Neck",
    price: 230,
    duration: "15 mins",
    preparation: "No food or drink 4 hours before the scan if contrast is used."
  },
  { id: "ct-sinus", name: "Sinus", scanTypeId: "ct-scan", category: "Head & Neck", price: 210, duration: "10 mins", preparation: "No preparation needed." },
  { id: "ct-chest", name: "Chest", scanTypeId: "ct-scan", category: "Torso", price: 280, duration: "20 mins", preparation: "Breathe normally. Remove jewelry." },
  { id: "ct-abdomen", name: "Abdomen", scanTypeId: "ct-scan", category: "Torso", price: 300, duration: "30 mins", preparation: "Fasting may be required for 6 hours." },
  { id: "ct-pelvis", name: "Pelvis", scanTypeId: "ct-scan", category: "Torso", price: 280, duration: "30 mins", preparation: "Full bladder may be required." },
  { id: "ct-spine-cervical", name: "Spine (Cervical)", scanTypeId: "ct-scan", category: "Spine", price: 260, duration: "20 mins", preparation: "Remove neck jewelry." },
  { id: "ct-spine-thoracic", name: "Spine (Thoracic)", scanTypeId: "ct-scan", category: "Spine", price: 260, duration: "20 mins", preparation: "No preparation needed." },
  { id: "ct-spine-lumbar", name: "Spine (Lumbar)", scanTypeId: "ct-scan", category: "Spine", price: 260, duration: "20 mins", preparation: "No preparation needed." },

  // X-Rays
  { id: "xr-chest", name: "Chest PA/Lateral", scanTypeId: "xray-scan", category: "Torso", price: 80, duration: "5-10 mins", preparation: "Wear loose clothing." },
  { id: "xr-skull", name: "Skull", scanTypeId: "xray-scan", category: "Head & Neck", price: 70, duration: "10 mins", preparation: "Remove hair clips/glasses." },
  { id: "xr-hand", name: "Hand", scanTypeId: "xray-scan", category: "Extremities", price: 60, duration: "5 mins", preparation: "Remove rings." },
  { id: "xr-wrist", name: "Wrist", scanTypeId: "xray-scan", category: "Extremities", price: 60, duration: "5 mins", preparation: "No preparation needed." },
  { id: "xr-arm", name: "Forearm/Arm", scanTypeId: "xray-scan", category: "Extremities", price: 65, duration: "5 mins", preparation: "No preparation needed." },
  { id: "xr-shoulder", name: "Shoulder", scanTypeId: "xray-scan", category: "Extremities", price: 75, duration: "10 mins", preparation: "No preparation needed." },
  { id: "xr-leg", name: "Leg/Femur", scanTypeId: "xray-scan", category: "Extremities", price: 85, duration: "10 mins", preparation: "No preparation needed." },
  { id: "xr-knee", name: "Knee", scanTypeId: "xray-scan", category: "Extremities", price: 70, duration: "5 mins", preparation: "No preparation needed." },
  { id: "xr-ankle", name: "Ankle", scanTypeId: "xray-scan", category: "Extremities", price: 65, duration: "5 mins", preparation: "No preparation needed." },
  { id: "xr-foot", name: "Foot", scanTypeId: "xray-scan", category: "Extremities", price: 60, duration: "5 mins", preparation: "No preparation needed." },
  { id: "xr-spine-cervical", name: "Spine (Cervical)", scanTypeId: "xray-scan", category: "Spine", price: 90, duration: "15 mins", preparation: "No preparation needed." },
  { id: "xr-spine-lumbar", name: "Spine (Lumbar)", scanTypeId: "xray-scan", category: "Spine", price: 90, duration: "15 mins", preparation: "No preparation needed." },

  // Ultrasound
  { id: "us-abdomen", name: "Whole Abdomen", scanTypeId: "ultrasound-scan", category: "Torso", price: 120, duration: "20-30 mins", preparation: "Fasting for 8 hours. No fatty foods." },
  { id: "us-pelvis", name: "Pelvis (OB/GYN)", scanTypeId: "ultrasound-scan", category: "Torso", price: 110, duration: "20 mins", preparation: "Full bladder required. Drink 1L water 1 hour before." },
  { id: "us-breast", name: "Breast", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 100, duration: "20 mins", preparation: "No deodorant or powder on breasts." },
  { id: "us-thyroid", name: "Thyroid", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 90, duration: "15 mins", preparation: "No preparation needed." },
  { id: "us-scrotum", name: "Scrotum", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 95, duration: "15 mins", preparation: "No preparation needed." },
  { id: "us-carotid", name: "Carotid Doppler", scanTypeId: "ultrasound-scan", category: "Vascular", price: 150, duration: "30 mins", preparation: "No preparation needed." },
  { id: "us-venous-doppler", name: "Venous Doppler (Legs)", scanTypeId: "ultrasound-scan", category: "Vascular", price: 140, duration: "45 mins", preparation: "No preparation needed." },
];
