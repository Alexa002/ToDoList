import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../../../models/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClient,  } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {

  @Output() taskCreated = new EventEmitter<Task>();

  taskForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isExpanded = false;

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.taskForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      dueDate: ['']
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const taskData = {
        title: this.taskForm.get('title')?.value?.trim(),
        description: this.taskForm.get('description')?.value?.trim() || '',
        dueDate: this.taskForm.get('dueDate')?.value || null
      };

      this.taskService.createTask(taskData).subscribe({
        next: (newTask) => {
          this.taskCreated.emit(newTask);``
          this.taskForm.reset();
          this.isExpanded = false;
          this.isLoading = false;
        }, error: (error) => {
          this.errorMessage = 'Failed to create task. Please try again.' + error.error?.message;
          this.isLoading = false;
        }
      });

    } else {
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }

  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.taskForm.reset();
    }
  }

  get title() { return this.taskForm.get('title'); }


}
