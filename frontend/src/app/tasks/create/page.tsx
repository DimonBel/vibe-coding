'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { taskApi, CreateTaskRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CreateTaskPage() {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
  }>({ title: '', description: '', priority: 'medium', status: 'pending' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskApi.create({
        title: form.title,
        description: form.description,
        status: form.status,
        details: { priority: form.priority },
      });
      setSuccess(true);
      setForm({ title: '', description: '', priority: 'medium', status: 'pending' });
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      // Optionally show error
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-2xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full opacity-20 blur-3xl -z-10" />
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <div className="bg-blue-100 rounded-full p-3 mb-2"><PlusCircle className="text-blue-600" size={32} /></div>
          <CardTitle className="text-3xl font-extrabold text-blue-900">Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-semibold animate-fade-in">
              Task created successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="border rounded-lg px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="border rounded-lg px-4 py-2 text-base focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
            <div className="flex gap-4">
              <select name="priority" value={form.priority} onChange={handleChange} className="border rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-400">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select name="status" value={form.status} onChange={handleChange} className="border rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-blue-400">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg text-lg py-2" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
            <Link href="/" className="text-blue-600 hover:underline text-sm mt-2 text-center">&larr; Back to Dashboard</Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 