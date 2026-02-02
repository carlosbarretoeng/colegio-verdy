import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  // Autenticação
  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getSession() {
    return await this.supabase.auth.getSession();
  }

  async getCurrentUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // Operações genéricas
  async select<T>(table: string, options?: any) {
    return await this.supabase.from(table).select('*', options);
  }

  async selectById<T>(table: string, id: string) {
    return await this.supabase.from(table).select('*').eq('id', id).single();
  }

  async insert<T>(table: string, data: T) {
    return await this.supabase.from(table).insert([data]).select();
  }

  async update<T>(table: string, id: string, data: Partial<T>) {
    return await this.supabase.from(table).update(data).eq('id', id).select();
  }

  async delete(table: string, id: string) {
    return await this.supabase.from(table).delete().eq('id', id);
  }

  // Subscribe to changes
  onChanges(table: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        callback
      )
      .subscribe();
  }
}
