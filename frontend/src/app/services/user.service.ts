import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface User {
  id: string;
  email: string;
  full_name?: string;
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

  constructor(private supabase: SupabaseService) {}

  /**
   * Buscar todos os usuários
   */
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.usersSubject.next(data || []);
      return data || [];
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
      const { data, error } = await this.supabase
        .getClient()
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data || null;
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
      const { data, error } = await this.supabase
        .getClient()
        .from('users')
        .insert([user])
        .select()
        .single();

      if (error) throw error;
      await this.getUsers(); // Atualizar lista
      return data || null;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .from('users')
        .update(user)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await this.getUsers(); // Atualizar lista
      return data || null;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  /**
   * Deletar usuário
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .getClient()
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.getUsers(); // Atualizar lista
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}
