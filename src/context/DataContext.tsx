"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BodyPart, Appointment, Invoice, Staff, Equipment, AuditLog, Patient,
  bodyParts as initialBodyParts, initialStaff, initialEquipment
} from '@/lib/data';

interface DataContextType {
  records: BodyPart[];
  appointments: Appointment[];
  invoices: Invoice[];
  staff: Staff[];
  equipment: Equipment[];
  auditLogs: AuditLog[];
  patients: Patient[];
  isOnline: boolean;
  isSyncing: boolean;

  // Actions
  addRecord: (record: BodyPart) => void;
  updateRecord: (record: BodyPart) => void;
  deleteRecord: (id: string) => void;
  addAppointment: (apt: any) => void;
  updateAppointment: (id: string, status: string) => void;
  attachReport: (id: string) => void;
  addInvoice: (inv: Invoice) => void;
  payInvoice: (id: string) => void;
  addStaff: (member: Staff) => void;
  updateStaff: (member: Staff) => void;
  deleteStaff: (id: string) => void;
  addEquipment: (item: Equipment) => void;
  updateEquipment: (item: Equipment) => void;
  deleteEquipment: (id: string) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPatients: Patient[] = [
  { id: "pat-1", name: "Kwame Antwi", email: "kwame@example.com", phone: "+233 24 123 4567", dob: "1985-05-12", gender: "Male", bloodGroup: "O+", history: [] },
  { id: "pat-2", name: "Ama Serwaa", email: "ama@example.com", phone: "+233 24 987 6543", dob: "1992-08-24", gender: "Female", bloodGroup: "A-", history: [] },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<BodyPart[]>(initialBodyParts);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Initialize data from localStorage and Backend API
  useEffect(() => {
    const loadFromLocal = (key: string, def: any) => {
      if (typeof window === 'undefined') return def;
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : def;
    };

    const loadFromApi = async () => {
      setIsSyncing(true);
      try {
        const [aptRes, patRes, logRes, invRes, staffRes, equipRes] = await Promise.all([
          fetch('/api/appointments'),
          fetch('/api/patients'),
          fetch('/api/logs'),
          fetch('/api/invoices'),
          fetch('/api/staff'),
          fetch('/api/equipment')
        ]);

        if (aptRes.ok) {
           const apts = await aptRes.json();
           // Map API model to local context model
           const mappedApts = apts.map((a: any) => ({
             ...a,
             date: new Date(a.date).toLocaleDateString(),
             reportAttached: !!a.report
           }));
           setAppointments(mappedApts);
        }

        if (patRes.ok) {
          const pats = await patRes.json();
          setPatients(pats.map((p: any) => ({
            ...p,
            dob: new Date(p.dob).toISOString().split('T')[0]
          })));
        }

        if (logRes.ok) {
           const logs = await logRes.json();
           setAuditLogs(logs.map((l: any) => ({
             ...l,
             timestamp: new Date(l.timestamp).toLocaleString()
           })));
        }

        if (invRes.ok) {
           const invs = await invRes.json();
           setInvoices(invs.map((i: any) => ({
             ...i,
             date: new Date(i.date).toLocaleDateString()
           })));
        }

        if (staffRes.ok) {
           const members = await staffRes.json();
           setStaff(members);
        }

        if (equipRes.ok) {
           const items = await equipRes.json();
           setEquipment(items.map((e: any) => ({
             ...e,
             lastMaintenance: new Date(e.lastMaintenance).toISOString().split('T')[0]
           })));
        }
      } catch (err) {
        console.error("Critical: API Sync Failure. Reverting to Local Cache.", err);
        setAppointments(loadFromLocal('grace_appointments', []));
        setPatients(loadFromLocal('grace_patients', initialPatients));
        setAuditLogs(loadFromLocal('grace_audit_logs', []));
      } finally {
        setIsSyncing(false);
      }
    };

    setRecords(loadFromLocal('grace_records', initialBodyParts));
    setInvoices(loadFromLocal('grace_invoices', []));
    setStaff(loadFromLocal('grace_staff', initialStaff));
    setEquipment(loadFromLocal('grace_equipment', initialEquipment));
    setSyncQueue(loadFromLocal('grace_sync_queue', []));

    loadFromApi();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ⚡ OPTIMIZATION: Individual persistence hooks
  // Splitting the massive sync effect into granular hooks prevents redundant
  // JSON.stringify() and localStorage.setItem() operations on unaffected data keys.
  // This reduces main-thread blocking during state updates.
  useEffect(() => { localStorage.setItem('grace_records', JSON.stringify(records)); }, [records]);
  useEffect(() => { localStorage.setItem('grace_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('grace_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('grace_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('grace_equipment', JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem('grace_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('grace_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('grace_sync_queue', JSON.stringify(syncQueue)); }, [syncQueue]);

  const logAction = async (action: string, module: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: "System Admin",
      action,
      timestamp: new Date().toLocaleString(),
      module
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 50));

    // Persist to API
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, module, user: "System Admin" })
      });
    } catch (e) {
       console.error("Log persistence failure.");
    }
  };

  const addToQueue = (action: string, payload: any) => {
    if (!isOnline) {
      setSyncQueue(prev => [...prev, { action, payload, timestamp: new Date().toISOString() }]);
    }
  };

  const syncData = async () => {
    if (!isOnline || syncQueue.length === 0) return;
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setSyncQueue([]);
    setIsSyncing(false);
    logAction("Manual Data Sync Completed", "System");
  };

  // Actions
  const addRecord = (record: BodyPart) => {
    setRecords(p => [record, ...p]);
    logAction(`Added scan record: ${record.name}`, "Inventory");
    addToQueue('ADD_RECORD', record);
  };

  const updateRecord = (record: BodyPart) => {
    setRecords(p => p.map(r => r.id === record.id ? record : r));
    logAction(`Updated scan record: ${record.name}`, "Inventory");
    addToQueue('UPDATE_RECORD', record);
  };

  const deleteRecord = (id: string) => {
    setRecords(p => p.filter(r => r.id !== id));
    logAction(`Deleted record: ${id}`, "Inventory");
    addToQueue('DELETE_RECORD', { id });
  };

  const addAppointment = (apt: any) => {
    setAppointments(p => [apt, ...p]);
    logAction(`New appointment booked for: ${apt.patientName}`, "Appointments");
    addToQueue('ADD_APPOINTMENT', apt);
  };

  const updateAppointment = (id: string, status: string) => {
    setAppointments(p => p.map(a => a.id === id ? { ...a, status: status as any } : a));
    logAction(`Appointment ${id} status updated to ${status}`, "Appointments");
    addToQueue('UPDATE_APPOINTMENT', { id, status });
  };

  const attachReport = (id: string) => {
    setAppointments(p => p.map(a => a.id === id ? { ...a, reportAttached: true } : a));
    logAction(`Diagnostic report attached to appointment ${id}`, "Clinical");
  };

  const addInvoice = async (inv: Invoice) => {
    setInvoices(p => [inv, ...p]);
    logAction(`Invoice generated for ${inv.patientName}: GH₵${inv.amount}`, "Billing");
    addToQueue('ADD_INVOICE', inv);
    try {
      await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inv)
      });
    } catch (e) { console.error(e); }
  };

  const payInvoice = async (id: string) => {
    setInvoices(p => p.map(i => i.id === id ? { ...i, status: 'paid' } : i));
    logAction(`Payment received for invoice ${id}`, "Billing");
    addToQueue('PAY_INVOICE', { id });
    try {
      await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'paid' })
      });
    } catch (e) { console.error(e); }
  };

  const addStaff = async (member: Staff) => {
    setStaff(p => [member, ...p]);
    logAction(`Registered new staff member: ${member.name}`, "Human Resources");
    try {
      await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    } catch (e) { console.error(e); }
  };

  const updateStaff = async (member: Staff) => {
    setStaff(p => p.map(s => s.id === member.id ? member : s));
    logAction(`Updated staff profile: ${member.name}`, "Human Resources");
    try {
      await fetch('/api/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
    } catch (e) { console.error(e); }
  };

  const deleteStaff = async (id: string) => {
    setStaff(p => p.filter(s => s.id !== id));
    logAction(`Terminated staff session: ${id}`, "Human Resources");
    try {
      await fetch(`/api/staff?id=${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  const addEquipment = async (item: Equipment) => {
    setEquipment(p => [item, ...p]);
    logAction(`New asset registered: ${item.name}`, "Assets");
    try {
      await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (e) { console.error(e); }
  };

  const updateEquipment = async (item: Equipment) => {
    setEquipment(p => p.map(e => e.id === item.id ? item : e));
    logAction(`Updated equipment status: ${item.name}`, "Assets");
    try {
      await fetch('/api/equipment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (e) { console.error(e); }
  };

  const deleteEquipment = async (id: string) => {
    setEquipment(p => p.filter(e => e.id !== id));
    logAction(`Decommissioned asset: ${id}`, "Assets");
    try {
      await fetch(`/api/equipment?id=${id}`, { method: 'DELETE' });
    } catch (e) { console.error(e); }
  };

  const addPatient = (patient: Patient) => {
    setPatients(p => [patient, ...p]);
    logAction(`Enrolled new patient: ${patient.name}`, "Clinical");
  };

  const updatePatient = (patient: Patient) => {
    setPatients(p => p.map(pt => pt.id === patient.id ? patient : pt));
    logAction(`Updated medical record: ${patient.name}`, "Clinical");
  };

  return (
    <DataContext.Provider value={{
      records, appointments, invoices, staff, equipment, auditLogs, patients, isOnline, isSyncing,
      addRecord, updateRecord, deleteRecord, addAppointment, updateAppointment, attachReport,
      addInvoice, payInvoice, addStaff, updateStaff, deleteStaff, addEquipment, updateEquipment, deleteEquipment,
      addPatient, updatePatient, syncData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
