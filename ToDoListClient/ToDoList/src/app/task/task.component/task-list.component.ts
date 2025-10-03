import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { AccountService } from '../../services/account.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskForm } from "../task-form.component/task-forms/task-form";

import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task.component',
  imports: [CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule, TaskForm,
    MatInputModule
    ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  currentUserName: string | null = null;
  filterStatus: 'all' | 'completed' | 'pending' = 'all';

  constructor(private taskService: TaskService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
        this.isLoading = false;
      }, error: (error) => {
        this.errorMessage = 'Failed to load tasks. Please try again later.';
        this.isLoading = false;
        console.error('Error loading tasks:', error);
      }, complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {

    switch (this.filterStatus) {
      case 'completed':
        this.filteredTasks = this.tasks.filter(t => t.isCompleted);
        break;
      case 'pending':
        this.filteredTasks = this.tasks.filter(t => !t.isCompleted);
        break;
      default:
        this.filteredTasks = this.tasks;
        break;
    }

  }

  onFilterChange(status: 'all' | 'completed' | 'pending'): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  onTaskToggled(taskId: number): void {
    this.taskService.toggleTaskCompletion(taskId).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.applyFilter();
        };
      }
    });
  }

  onTaskDeleted(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.applyFilter();
      }, error: (error) => {
        this.errorMessage = 'Failed to delete task. Please try again later.';
        console.error('Error deleting task:', error);
      }
    });
  }

  onTaskCreated(newTask: Task): void {
    this.tasks.unshift(newTask);
    this.applyFilter();
  }


  logout(): void {
    this.accountService.logout();
  }

  get taskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  }




}
