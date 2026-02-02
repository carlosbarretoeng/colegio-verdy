import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenKey = 'auth_token';

  constructor(
    private api: ApiService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.initAuth();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private async initAuth() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const response: any = await firstValueFrom(this.api.get('/me'));
        this.currentUserSubject.next(response.user);
      } catch (error) {
        localStorage.removeItem(this.tokenKey);
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null);
    }
  }

  async signIn(email: string, password: string) {
    this.loadingService.show();
    try {
      const response: any = await firstValueFrom(
        this.api.post('/login', { email, password })
      );
      
      localStorage.setItem(this.tokenKey, response.token);
      this.currentUserSubject.next(response.user);
      this.router.navigate(['/app/dashboard']);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  async signUp(email: string, password: string, name: string, role?: string) {
    this.loadingService.show();
    try {
      const response: any = await firstValueFrom(
        this.api.post('/register', { 
          email, 
          password, 
          password_confirmation: password,
          name,
          role 
        })
      );

      localStorage.setItem(this.tokenKey, response.token);
      this.currentUserSubject.next(response.user);
      this.router.navigate(['/app/dashboard']);

      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }

  async signOut() {
    this.loadingService.show();
    try {
      await firstValueFrom(this.api.post('/logout', {}));
      localStorage.removeItem(this.tokenKey);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem(this.tokenKey);
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } finally {
      this.loadingService.hide();
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  async resetPassword(email: string) {
    this.loadingService.show();
    try {
      // TODO: Implementar endpoint de reset password no Laravel
      await firstValueFrom(
        this.api.post('/forgot-password', { email })
      );
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      this.loadingService.hide();
    }
  }
}
