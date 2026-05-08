"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where we DON'T want the public Navbar and Footer
  const isAuthOrAdmin = pathname.startsWith("/admin") ||
                        pathname.startsWith("/pos") ||
                        pathname.startsWith("/login");

  if (isAuthOrAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
