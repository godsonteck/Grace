import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DataProvider } from "@/context/DataContext";

export const metadata: Metadata = {
  title: "Grace Diagnostic Center",
  description: "Advanced imaging services including CT, X-ray, and Ultrasound.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <DataProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
