import Link from "next/link";
import { Activity } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight text-secondary">
              GRACE <span className="text-primary tracking-normal">DIAGNOSTIC</span>
            </span>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-secondary hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link href="/scans" className="text-secondary hover:text-primary transition-colors font-medium">
              Scans
            </Link>
            <Link href="/branches" className="text-secondary hover:text-primary transition-colors font-medium">
              Branches
            </Link>
            <Link href="/admin" className="text-secondary hover:text-primary transition-colors font-medium">
              Admin
            </Link>
          </div>
          <div className="hidden md:block">
            <Link href="/book" className="bg-primary text-white px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 text-sm">
              Book Appointment
            </Link>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </nav>
  );
}
