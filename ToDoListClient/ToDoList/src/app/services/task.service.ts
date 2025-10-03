import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountService } from './account.service';
import { CreateTaskRequest, Task, UpdateTaskRequest } from '../models/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = environment.apiUrl + '/task/';

  constructor(private http: HttpClient, private accountService: AccountService) { }

  private getHeaders(): HttpHeaders {
    const token = this.accountService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks() {
    return this.http.get<Task[]>(this.baseUrl + 'tasks', { headers: this.getHeaders() });
  }

  getTask(id: number) {
    return this.http.get<Task>(this.baseUrl + id, { headers: this.getHeaders() });
  }

  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl + 'create', task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(this.baseUrl + 'update', task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + 'delete/' + id, {headers: this.getHeaders()});
  }

  toggleTaskCompletion(id: number): Observable<Task> {
    return this.http.patch<Task>(this.baseUrl + id + '/toggle' , {}, { headers: this.getHeaders() });
  }

  getCompletedTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl + 'completed', { headers: this.getHeaders() });
  }

  getPendingTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl + 'pending', { headers: this.getHeaders() });
  }








}
