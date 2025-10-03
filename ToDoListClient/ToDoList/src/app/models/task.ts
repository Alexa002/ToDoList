export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string;
  dueDate?: string;
  userId: number;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
}