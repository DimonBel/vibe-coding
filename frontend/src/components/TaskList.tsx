'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Task } from '@/lib/api';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority?: string) => string;
  onAssignUser: (task: Task) => void;
}

export default function TaskList({ tasks, onEdit, onDelete, getStatusColor, getPriorityColor, onAssignUser }: TaskListProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned Users</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{task.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {task.description}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.details?.priority)}>
                  {task.details?.priority || 'medium'}
                </Badge>
              </TableCell>
              <TableCell>
                {task.details?.due_date ? formatDate(task.details.due_date) : '-'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.users.length > 0 ? (
                    task.users.map((user) => (
                      <Badge key={user.id} variant="outline" className="text-xs">
                        {user.username}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No users assigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {formatDate(task.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onAssignUser(task)}
                  >
                    Assign User
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 