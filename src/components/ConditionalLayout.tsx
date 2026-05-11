"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useData } from "@/context/DataContext";
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOnline, isSyncing } = useData();
  const [showToast, setShowToast] = useState(false);

  // Toast for sync completion
  useEffect(() => {
    if (!isSyncing && isOnline) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  const isAuthOrAdmin = pathname.startsWith("/admin") ||
                        pathname.startsWith("/pos") ||
                        pathname.startsWith("/login");

  return (
    <>
      {!isAuthOrAdmin && <Navbar />}
      <main className="flex-grow relative">
        {children}

        {/* Global Notifications */}
        <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 pointer-events-none">
           {/* Sync Notification */}
           <div className={cn(
             "px-8 py-5 rounded-[30px] bg-secondary text-white shadow-2xl flex items-center gap-4 transition-all duration-700 translate-x-20 opacity-0",
             showToast && "translate-x-0 opacity-100"
           )}>
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                 <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Cloud Synchronized</p>
                 <p className="text-sm font-black italic">Systems Optimized</p>
              </div>
           </div>

           {/* Offline Warning */}
           {!isOnline && (
             <div className="px-8 py-5 rounded-[30px] bg-red-600 text-white shadow-2xl flex items-center gap-4 animate-bounce pointer-events-auto">
                <WifiOff className="h-6 w-6" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-red-200">Connectivity Lost</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Working Offline</p>
                </div>
             </div>
           )}
        </div>
      </main>
      {!isAuthOrAdmin && <Footer />}
    </>
  );
}
