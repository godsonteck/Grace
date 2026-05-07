import { branches } from "@/lib/data";
import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export default function BranchesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Our Branches</h1>
        <p className="text-muted text-lg">
          Grace Diagnostic Center serves you across multiple locations with the same commitment to excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {branches.map((branch) => (
          <div key={branch.id} className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-slate-50 p-8 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-secondary mb-2">{branch.name}</h2>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Certified Diagnostic Center</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Location</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-secondary font-medium">{branch.address}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-secondary font-medium">{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-secondary font-medium">{branch.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Operating Hours</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-secondary font-medium">Mon - Fri: 8:00 AM - 8:00 PM</p>
                        <p className="text-secondary font-medium">Sat: 9:00 AM - 5:00 PM</p>
                        <p className="text-secondary font-medium text-primary">Sun: Emergency Only</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-bold transition-all">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold text-secondary mb-6">Need Assistance?</h2>
          <p className="text-lg text-secondary/70 mb-8">
            If you have questions about which branch offers specific specialized tests, or if you need to schedule an appointment, our central helpline is available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Central Helpline</p>
                <p className="text-lg font-bold text-secondary">1-800-GRACE-DX</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Email Support</p>
                <p className="text-lg font-bold text-secondary">support@grace.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
