import { Injectable } from '@angular/core';
import { environment } from '../../enviroment/enviroment.prod';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  private currentUserSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      const userName = this.getUserNameFromToken(token);
      this.currentUserSubject.next(userName);
    }


  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + '/api/account/register', registerData)
      .pipe(tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.userName);
      }))

  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.baseUrl + '/api/account/login', loginData)
      .pipe(tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.userName);
      }))
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }



  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }


  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUserNameFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    } catch (e) {
      return '';
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
