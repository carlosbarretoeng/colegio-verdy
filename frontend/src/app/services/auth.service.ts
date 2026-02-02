import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { LoadingService } from './loading.service';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.initAuthListener();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private async initAuthListener() {
    // Verificar sessão atual
    const { data } = await this.supabase.getSession();
    if (data.session) {
      this.currentUserSubject.next(data.session.user);
    }

    // Escutar mudanças de autenticação
    this.supabase.getClient().auth.onAuthStateChange((event, session) => {
      if (session) {
        this.currentUserSubject.next(session.user);
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async signUp(email: string, password: string, metadata?: any) {
    this.loadingService.show();
    try {
      const { data, error } = await this.supabase.signUp(email, password);
      
      if (error) {
        throw error;
      }

      // Adicionar metadata se fornecido
      if (metadata && data.user) {
        await this.supabase.getClient().auth.updateUser({
          data: metadata,
        });
      }

      return data;
    } finally {
      this.loadingService.hide();
    }
  }

  async signIn(email: string, password: string) {
    this.loadingService.show();
    try {
      const { data, error } = await this.supabase.signIn(email, password);
      
      if (error) {
        throw error;
      }

      if (data.user) {
        this.currentUserSubject.next(data.user);
        this.router.navigate(['/app/dashboard']);
      }

      return data;
    } finally {
      this.loadingService.hide();
    }
  }

  async signOut() {
    this.loadingService.show();
    try {
      await this.supabase.signOut();
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string) {
    this.loadingService.show();
    try {
      const { data, error } = await this.supabase.getClient().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      return data;
    } finally {
      this.loadingService.hide();
    }
  }

  async updatePassword(newPassword: string) {
    this.loadingService.show();
    try {
      const { data, error } = await this.supabase.getClient().auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      return data;
    } finally {
      this.loadingService.hide();
    }
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  async refreshSession() {
    const { data, error } = await this.supabase.getClient().auth.refreshSession();
    if (error) {
      throw error;
    }
    return data;
  }
}
