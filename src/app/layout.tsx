import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import ConditionalLayout from "@/components/ConditionalLayout";

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
        <AuthProvider>
          <DataProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
