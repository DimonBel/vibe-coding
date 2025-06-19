'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, taskApi, CreateTaskRequest, UpdateTaskRequest, User, userApi } from '@/lib/api';
import { toast } from 'sonner';
import TaskDialog from '@/components/TaskDialog';
import TaskList from '@/components/TaskList';
import UserManagement from '@/components/UserManagement';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home as HomeIcon, ListChecks, Users, Settings, PlusCircle, BarChart, MessageCircle, Dumbbell, Film } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [assignUserTask, setAssignUserTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskApi.getAll();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to load tasks');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    userApi.getAll().then(setUsers);
  }, []);

  const handleTaskSubmit = async (taskId: string | null, data: unknown) => {
    const taskData = data as CreateTaskRequest | UpdateTaskRequest;
    try {
      if (taskId) {
        await taskApi.update(taskId, taskData as UpdateTaskRequest);
        toast.success('Task updated successfully');
        setEditingTask(null);
      } else {
        await taskApi.create(taskData as CreateTaskRequest);
        toast.success('Task created successfully');
        setIsTaskDialogOpen(false);
      }
      loadTasks();
    } catch (error) {
      toast.error(taskId ? 'Failed to update task' : 'Failed to create task');
      console.error('Error handling task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      toast.success('Task deleted successfully');
      loadTasks();
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    pending: tasks.filter(task => task.status === 'pending').length,
  };

  // Recent tasks (show 5 most recent)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const handleAssignUser = async () => {
    if (!assignUserTask || !selectedUserId) return;
    setAssigning(true);
    try {
      await taskApi.assignUser(assignUserTask.id, selectedUserId);
      toast.success('User assigned to task');
      setAssignUserTask(null);
      setSelectedUserId('');
      loadTasks();
    } catch (error) {
      toast.error('Failed to assign user');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/90 border-r px-6 py-8 space-y-8 shadow-lg rounded-r-3xl">
        <div className="flex items-center gap-3 mb-10">
          <BarChart className="text-blue-600" size={28} />
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">TaskDash</span>
        </div>
        <nav className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <HomeIcon size={20} /> Dashboard
          </Link>
          <Link href="/tasks/create" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <PlusCircle size={20} /> Create Task
          </Link>
          <Link href="/users" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <Users size={20} /> Users
          </Link>
          <Link href="/playground" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <MessageCircle size={20} /> Playground
          </Link>
          <Link href="/habit-trainer" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <Dumbbell size={20} /> Habit Trainer
          </Link>
          <Link href="/emotion-recognition" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <span role="img" aria-label="Emotion">😊</span> Emotion Recognition
          </Link>
          <Link href="/films" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <Film size={20} /> Film Recommendations
          </Link>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 font-semibold transition-colors">
            <Settings size={20} /> Settings
          </a>
        </nav>
        <div className="mt-auto flex items-center gap-4 bg-blue-50 rounded-xl p-3 shadow-inner">
          <Avatar className="h-10 w-10">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-gray-900">John Doe</div>
            <div className="text-xs text-blue-600 font-medium">Admin</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Bar */}
        <header className="flex items-center justify-between px-10 py-6 bg-white/80 border-b shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-base mt-1">Welcome back! Here's what's happening with your tasks today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => setIsTaskDialogOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md">
              <PlusCircle size={20} /> New Task
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-8">
          <Card className="flex flex-col items-start justify-between h-full w-full bg-gradient-to-br from-blue-100 to-white border-0 shadow-md rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <BarChart className="text-blue-600" size={24} />
              <CardTitle className="text-base font-semibold">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-900">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start justify-between h-full w-full bg-gradient-to-br from-green-100 to-white border-0 shadow-md rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <ListChecks className="text-green-600" size={24} />
              <CardTitle className="text-base font-semibold">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-700">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start justify-between h-full w-full bg-gradient-to-br from-blue-200 to-white border-0 shadow-md rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <ListChecks className="text-blue-600" size={24} />
              <CardTitle className="text-base font-semibold">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-blue-700">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start justify-between h-full w-full bg-gradient-to-br from-yellow-100 to-white border-0 shadow-md rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <ListChecks className="text-yellow-600" size={24} />
              <CardTitle className="text-base font-semibold">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-10 pb-10">
          {/* Task List */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Card className="shadow-lg rounded-2xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Tasks</CardTitle>
                <CardDescription className="text-base">Manage and track your tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onEdit={(task: Task) => setEditingTask(task)}
                    onDelete={handleDeleteTask}
                    getStatusColor={getStatusColor}
                    getPriorityColor={getPriorityColor}
                    onAssignUser={(task: Task) => setAssignUserTask(task)}
                  />
                )}
              </CardContent>
            </Card>
            {/* Recent Activity */}
            <Card className="shadow-lg rounded-2xl border-0 bg-white/90">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Tasks</CardTitle>
                <CardDescription className="text-base">Latest tasks created</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {recentTasks.length === 0 && (
                    <li className="py-3 text-gray-500 text-base">No recent tasks.</li>
                  )}
                  {recentTasks.map(task => (
                    <li key={task.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900">{task.title}</span>
                        <span className="ml-3 text-xs">
                          <Badge className={getStatusColor(task.status) + ' px-2 py-1 rounded-full text-xs font-semibold'}>{task.status.replace('_', ' ')}</Badge>
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(task.created_at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <div className="flex flex-col gap-8">
            <UserManagement />
          </div>
        </div>

        {/* Task Dialog */}
        <TaskDialog
          open={isTaskDialogOpen || !!editingTask}
          onOpenChange={(open: boolean) => {
            if (!open) {
              setIsTaskDialogOpen(false);
              setEditingTask(null);
            }
          }}
          task={editingTask}
          onSubmit={handleTaskSubmit}
        />

        {/* Assign User Dialog */}
        {assignUserTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Assign User to Task</h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Select User</label>
                <select
                  className="border rounded-lg px-4 py-2 w-full"
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                >
                  <option value="">-- Select a user --</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setAssignUserTask(null)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignUser} disabled={!selectedUserId || assigning}>
                  {assigning ? 'Assigning...' : 'Assign User'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
