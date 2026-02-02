import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudPageListComponent, CrudConfig, CrudColumn } from '../../components/crud-page-list/crud-page-list';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, CrudPageListComponent],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css',
})
export class UsersList implements OnInit {
  users: User[] = [];
  isLoading = true;

  crudConfig: CrudConfig = {
    title: 'Usuários',
    columns: [
      { key: 'email', label: 'Email', width: '40%' },
      {
        key: 'name',
        label: 'Nome',
        width: '30%',
        format: (value) => value || '-',
      },
      {
        key: 'role',
        label: 'Função',
        width: '15%',
        format: (value) => this.formatRole(value),
      }
    ],
    editPath: '/app/users/edit',
    newPath: '/app/users/new',
    onDelete: (id: string) => this.userService.deleteUser(id),
  };

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.isLoading = true;
    try {
      this.users = await this.userService.getUsers();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Formatar função do usuário
   */
  private formatRole(role?: string): string {
    const roles: Record<string, string> = {
      admin: 'Administrador',
      parent: 'Responsável',
      teacher: 'Professor',
      student: 'Aluno',
      staff: 'Funcionário',
    };
    return roles[role || ''] || role || '-';
  }

  /**
   * Formatar data
   */
  private formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
