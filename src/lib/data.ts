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
}

export const branches: Branch[] = [
  {
    id: "main-branch",
    name: "Grace Diagnostic Center - Main Branch",
    address: "123 Medical Plaza, Downtown City",
    phone: "+1 (555) 123-4567",
    email: "info@gracediagnostic.com",
  },
  {
    id: "north-branch",
    name: "Grace Diagnostic Center - North Side",
    address: "456 Healthcare Ave, North District",
    phone: "+1 (555) 987-6543",
    email: "north@gracediagnostic.com",
  },
  {
    id: "east-branch",
    name: "Grace Diagnostic Center - East Wing",
    address: "789 Wellness Rd, East Valley",
    phone: "+1 (555) 456-7890",
    email: "east@gracediagnostic.com",
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
  { id: "ct-brain", name: "Brain", scanTypeId: "ct-scan", category: "Head & Neck", price: 250 },
  { id: "ct-neck", name: "Neck", scanTypeId: "ct-scan", category: "Head & Neck", price: 230 },
  { id: "ct-sinus", name: "Sinus", scanTypeId: "ct-scan", category: "Head & Neck", price: 210 },
  { id: "ct-chest", name: "Chest", scanTypeId: "ct-scan", category: "Torso", price: 280 },
  { id: "ct-abdomen", name: "Abdomen", scanTypeId: "ct-scan", category: "Torso", price: 300 },
  { id: "ct-pelvis", name: "Pelvis", scanTypeId: "ct-scan", category: "Torso", price: 280 },
  { id: "ct-spine-cervical", name: "Spine (Cervical)", scanTypeId: "ct-scan", category: "Spine", price: 260 },
  { id: "ct-spine-thoracic", name: "Spine (Thoracic)", scanTypeId: "ct-scan", category: "Spine", price: 260 },
  { id: "ct-spine-lumbar", name: "Spine (Lumbar)", scanTypeId: "ct-scan", category: "Spine", price: 260 },

  // X-Rays
  { id: "xr-chest", name: "Chest PA/Lateral", scanTypeId: "xray-scan", category: "Torso", price: 80 },
  { id: "xr-skull", name: "Skull", scanTypeId: "xray-scan", category: "Head & Neck", price: 70 },
  { id: "xr-hand", name: "Hand", scanTypeId: "xray-scan", category: "Extremities", price: 60 },
  { id: "xr-wrist", name: "Wrist", scanTypeId: "xray-scan", category: "Extremities", price: 60 },
  { id: "xr-arm", name: "Forearm/Arm", scanTypeId: "xray-scan", category: "Extremities", price: 65 },
  { id: "xr-shoulder", name: "Shoulder", scanTypeId: "xray-scan", category: "Extremities", price: 75 },
  { id: "xr-leg", name: "Leg/Femur", scanTypeId: "xray-scan", category: "Extremities", price: 85 },
  { id: "xr-knee", name: "Knee", scanTypeId: "xray-scan", category: "Extremities", price: 70 },
  { id: "xr-ankle", name: "Ankle", scanTypeId: "xray-scan", category: "Extremities", price: 65 },
  { id: "xr-foot", name: "Foot", scanTypeId: "xray-scan", category: "Extremities", price: 60 },
  { id: "xr-spine-cervical", name: "Spine (Cervical)", scanTypeId: "xray-scan", category: "Spine", price: 90 },
  { id: "xr-spine-lumbar", name: "Spine (Lumbar)", scanTypeId: "xray-scan", category: "Spine", price: 90 },

  // Ultrasound
  { id: "us-abdomen", name: "Whole Abdomen", scanTypeId: "ultrasound-scan", category: "Torso", price: 120 },
  { id: "us-pelvis", name: "Pelvis (OB/GYN)", scanTypeId: "ultrasound-scan", category: "Torso", price: 110 },
  { id: "us-breast", name: "Breast", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 100 },
  { id: "us-thyroid", name: "Thyroid", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 90 },
  { id: "us-scrotum", name: "Scrotum", scanTypeId: "ultrasound-scan", category: "Soft Tissue", price: 95 },
  { id: "us-carotid", name: "Carotid Doppler", scanTypeId: "ultrasound-scan", category: "Vascular", price: 150 },
  { id: "us-venous-doppler", name: "Venous Doppler (Legs)", scanTypeId: "ultrasound-scan", category: "Vascular", price: 140 },
];
