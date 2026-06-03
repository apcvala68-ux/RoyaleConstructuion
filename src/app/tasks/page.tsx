'use client';

import * as React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/ui/toast';
import { getInitials, getGradient } from '@/lib/utils';
import { USERS } from '@/data';
import { useAppStore } from '@/stores/app';
import { TaskStatus, TaskPriority } from '@/types';
import type { Task } from '@/types';
import {
  Plus, CheckSquare, Clock, AlertTriangle, Calendar,
  MoreHorizontal, Pencil, Trash2, ExternalLink, User,
} from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20',
  high: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20',
  medium: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20',
  low: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/15 dark:text-gray-400 dark:border-gray-500/20',
};

const COLUMNS: { status: TaskStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'overdue', label: 'Overdue', icon: AlertTriangle, color: 'text-destructive' },
  { status: 'pending', label: 'To Do', icon: Clock, color: 'text-muted-foreground' },
  { status: 'in-progress', label: 'In Progress', icon: CheckSquare, color: 'text-primary' },
  { status: 'completed', label: 'Done', icon: CheckSquare, color: 'text-success' },
];

const badgeClass = "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border";
const inputClass = "input w-full pl-3";
const selectClass = "select w-full pl-3";
const labelClass = "label";

function ViewTaskModal({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  if (!task) return null;
  const assignee = USERS.find((u) => u.id === task.assignedTo);
  return (
    <Modal open={open} onClose={onClose} title={task.title}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className={`${badgeClass} ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="text-xs text-muted-foreground capitalize">{task.status.replace('-', ' ')}</span>
        </div>
        <p className="text-sm text-muted-foreground">{task.description || 'No description'}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Due {new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        {assignee && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            Assigned to {assignee.name}
          </div>
        )}
        <p className="text-xs text-muted-foreground">Lead: {task.leadName}</p>
        <p className="text-xs text-muted-foreground">Created {new Date(task.createdAt).toLocaleDateString()}</p>
      </div>
    </Modal>
  );
}

function EditTaskModal({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  const updateTask = useAppStore((s) => s.updateTask);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = React.useState('');
  const [assignedTo, setAssignedTo] = React.useState('');

  React.useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.dueDate.split('T')[0]);
      setAssignedTo(task.assignedTo || '');
    }
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    updateTask(task.id, {
      title,
      description,
      priority,
      dueDate: new Date(dueDate).toISOString(),
      assignedTo,
    });
    toast('Task updated', 'success');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="input w-full h-auto py-2.5 resize-none pl-3" />
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={selectClass}>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Assigned To</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className={selectClass}>
            <option value="">Unassigned</option>
            {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteTaskModal({ task, open, onClose }: { task: Task | null; open: boolean; onClose: () => void }) {
  const deleteTask = useAppStore((s) => s.deleteTask);
  if (!task) return null;

  const handleDelete = () => {
    deleteTask(task.id);
    toast('Task deleted', 'success');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Task">
      <p className="text-sm text-muted-foreground mb-4">
        Are you sure you want to delete <strong className="text-foreground">{task.title}</strong>? This action cannot be undone.
      </p>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </div>
    </Modal>
  );
}

interface TaskCardProps {
  task: Task;
  onView: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

function TaskCard({ task, onView, onEdit, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const assignee = USERS.find(u => u.id === task.assignedTo);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 hover:shadow-hover transition-all duration-150 ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <span className={`${badgeClass} ${PRIORITY_COLORS[task.priority]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <div className="relative" ref={menuRef}>
            <Button variant="ghost" size="icon-sm" className="-m-2" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-lg py-1 z-50">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted w-full text-left cursor-pointer" onClick={() => { setMenuOpen(false); onView(task); }}>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> View Details
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted w-full text-left cursor-pointer" onClick={() => { setMenuOpen(false); onEdit(task); }}>
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> Edit
                </button>
                <hr className="border-border mx-2" />
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 w-full text-left cursor-pointer" onClick={() => { setMenuOpen(false); onDelete(task); }}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <p className="text-sm font-semibold text-foreground">{task.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{task.leadName}</p>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          {assignee && (
            <div className="flex items-center gap-1">
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br text-white text-[9px] font-bold flex items-center justify-center ${getGradient(assignee.id)}`}>
                {getInitials(assignee.name)}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface ColumnProps {
  column: typeof COLUMNS[0];
  tasks: Task[];
  onView: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}

function Column({ column, tasks, onView, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column min-w-[280px] rounded-xl border p-2 transition-all duration-200 ${
        isOver ? 'border-primary/50 bg-primary/5' : 'border-border bg-muted/30'
      }`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <column.icon className={`h-4 w-4 ${column.color}`} />
          <span className="text-sm font-bold text-foreground">{column.label}</span>
          <span className="flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="space-y-3 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const storeTasks = useAppStore((s) => s.tasks);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const [tasks, setTasks] = React.useState(storeTasks);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [filterPriority, setFilterPriority] = React.useState<TaskPriority | 'all'>('all');

  // view modal
  const [viewTask, setViewTask] = React.useState<Task | null>(null);
  // edit modal
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  // delete modal
  const [deleteTask, setDeleteTask] = React.useState<Task | null>(null);

  React.useEffect(() => { setTasks(storeTasks); }, [storeTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const filteredTasks = tasks.filter(t => filterPriority === 'all' || t.priority === filterPriority);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const toStatus = over.id as TaskStatus;

    updateTaskStatus(taskId, toStatus);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: toStatus } : t))
    );
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;
  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;

  return (
    <AppLayout>
      <div className="space-y-6 page-enter">
        <div className="page-header">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">
              {activeCount} active tasks • {overdueCount} overdue
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')} className="select w-auto">
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button><Plus className="h-4 w-4" /> New Task</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Overdue', value: tasks.filter(t => t.status === 'overdue').length, color: 'text-destructive', bg: 'bg-destructive/10' },
            { label: 'To Do', value: tasks.filter(t => t.status === 'pending').length, color: 'text-muted-foreground', bg: 'bg-muted' },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Done', value: tasks.filter(t => t.status === 'completed').length, color: 'text-success', bg: 'bg-success/10' },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
            </Card>
          ))}
        </div>

        {/* Kanban Board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {COLUMNS.map((col) => {
              const columnTasks = filteredTasks.filter(t => t.status === col.status);
              return (
                <Column
                  key={col.status}
                  column={col}
                  tasks={columnTasks}
                  onView={setViewTask}
                  onEdit={setEditTask}
                  onDelete={setDeleteTask}
                />
              );
            })}
          </div>
          <DragOverlay>
            {activeTask ? (
              <Card className="p-4 shadow-xl rotate-3 opacity-90 w-[280px]">
                <span className={`${badgeClass} ${PRIORITY_COLORS[activeTask.priority]}`}>
                  {PRIORITY_LABELS[activeTask.priority]}
                </span>
                <p className="text-sm font-semibold text-foreground mt-2">{activeTask.title}</p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modals */}
      <ViewTaskModal task={viewTask} open={!!viewTask} onClose={() => setViewTask(null)} />
      <EditTaskModal task={editTask} open={!!editTask} onClose={() => setEditTask(null)} />
      <DeleteTaskModal task={deleteTask} open={!!deleteTask} onClose={() => setDeleteTask(null)} />
    </AppLayout>
  );
}
