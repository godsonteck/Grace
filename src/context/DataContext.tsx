"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BodyPart, Appointment, Invoice, bodyParts as initialBodyParts } from '@/lib/data';

interface DataContextType {
  records: BodyPart[];
  appointments: Appointment[];
  invoices: Invoice[];
  isOnline: boolean;
  isSyncing: boolean;
  addRecord: (record: BodyPart) => void;
  updateRecord: (record: BodyPart) => void;
  deleteRecord: (id: string) => void;
  addAppointment: (apt: any) => void;
  updateAppointment: (id: string, status: string) => void;
  addInvoice: (inv: Invoice) => void;
  payInvoice: (id: string) => void;
  syncData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<BodyPart[]>(initialBodyParts);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Initialize data
  useEffect(() => {
    const savedRecords = localStorage.getItem('grace_records');
    const savedApts = localStorage.getItem('grace_appointments');
    const savedInvoices = localStorage.getItem('grace_invoices');
    const savedQueue = localStorage.getItem('grace_sync_queue');

    if (savedRecords) setRecords(JSON.parse(savedRecords));
    if (savedApts) setAppointments(JSON.parse(savedApts));
    if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
    if (savedQueue) setSyncQueue(JSON.parse(savedQueue));

    // Monitor connectivity
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

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('grace_records', JSON.stringify(records));
    localStorage.setItem('grace_appointments', JSON.stringify(appointments));
    localStorage.setItem('grace_invoices', JSON.stringify(invoices));
    localStorage.setItem('grace_sync_queue', JSON.stringify(syncQueue));
  }, [records, appointments, invoices, syncQueue]);

  // Automatic Sync when coming back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      syncData();
    }
  }, [isOnline]);

  const syncData = async () => {
    if (!isOnline || syncQueue.length === 0) return;

    setIsSyncing(true);
    // Simulate network delay for sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`Synced ${syncQueue.length} items to server.`);
    setSyncQueue([]);
    setIsSyncing(false);
  };

  const addToQueue = (action: string, payload: any) => {
    if (!isOnline) {
      setSyncQueue(prev => [...prev, { action, payload, timestamp: new Date().toISOString() }]);
    }
  };

  const addRecord = (record: BodyPart) => {
    setRecords(prev => [record, ...prev]);
    addToQueue('ADD_RECORD', record);
  };

  const updateRecord = (record: BodyPart) => {
    setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    addToQueue('UPDATE_RECORD', record);
  };

  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    addToQueue('DELETE_RECORD', { id });
  };

  const addAppointment = (apt: any) => {
    setAppointments(prev => [apt, ...prev]);
    addToQueue('ADD_APPOINTMENT', apt);
  };

  const updateAppointment = (id: string, status: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
    addToQueue('UPDATE_APPOINTMENT', { id, status });
  };

  const addInvoice = (inv: Invoice) => {
    setInvoices(prev => [inv, ...prev]);
    addToQueue('ADD_INVOICE', inv);
  };

  const payInvoice = (id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i));
    addToQueue('PAY_INVOICE', { id });
  };

  return (
    <DataContext.Provider value={{
      records, appointments, invoices, isOnline, isSyncing,
      addRecord, updateRecord, deleteRecord,
      addAppointment, updateAppointment, addInvoice, payInvoice, syncData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
