'use client';
import UserManagement from '@/components/UserManagement';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function UsersPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-8 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl -z-10" />
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 rounded-full p-3"><Users className="text-blue-600" size={32} /></div>
          <h2 className="text-3xl font-extrabold text-blue-900">User Management</h2>
        </div>
        <div className="mb-6">
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm transition">&larr; Back to Dashboard</Link>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-2xl p-6">
          <UserManagement />
        </div>
      </div>
    </div>
  );
} 