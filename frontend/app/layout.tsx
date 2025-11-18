import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import AmplitudeProvider from '@/components/AmplitudeProvider';

export const metadata: Metadata = {
  title: 'EcomStore - Microservices Ecommerce',
  description: 'A modern ecommerce store built with microservices architecture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AmplitudeProvider />
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
