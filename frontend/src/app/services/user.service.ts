import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string | number;
  email?: string;
  name?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private api: ApiService) {}

  /**
   * Buscar todos os usuários
   */
  async getUsers(): Promise<User[]> {
    try {
      const response: any = await firstValueFrom(this.api.get('/users'));
      const users = response.users || response || [];
      this.usersSubject.next(users);
      return users;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  }

  /**
   * Buscar usuário por ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const response: any = await firstValueFrom(this.api.get(`/users/${id}`));
      return response.user || response || null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  /**
   * Criar novo usuário
   */
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User | null> {
    try {
      const response: any = await firstValueFrom(this.api.post('/users', user));
      await this.getUsers();
      return response.user || response || null;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string | number, user: Partial<User>): Promise<User | null> {
    try {
      const response: any = await firstValueFrom(this.api.put(`/users/${id}`, user));
      await this.getUsers();
      return response.user || response || null;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  /**
   * Deletar usuário
   */
  async deleteUser(id: string | number): Promise<boolean> {
    try {
      await firstValueFrom(this.api.delete(`/users/${id}`));
      await this.getUsers();
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}
