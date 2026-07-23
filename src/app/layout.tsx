import './globals.css';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SADI Learning Hub | Southern Africa Development Institute',
  description: 'Enterprise Learning Management System for Pan-African executive development, public sector capacity building, online certifications, and institutional training.',
  keywords: ['SADI', 'LMS', 'Southern Africa Development Institute', 'Executive Training', 'Public Sector Leadership', 'Pan-African Certifications'],
  authors: [{ name: 'Southern Africa Development Institute' }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Navbar currentUser={user} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
