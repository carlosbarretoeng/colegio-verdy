import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';

export interface CrudColumn {
  key: string;
  label: string;
  width?: string;
  format?: (value: any) => string;
}

export interface CrudConfig {
  title: string;
  columns: CrudColumn[];
  newButtonLabel?: string;
  editPath: string;
  newPath: string;
  onDelete?: (id: string) => Promise<void> | Promise<boolean>;
}

@Component({
  selector: 'app-crud-page-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crud-page-list.html',
  styleUrl: './crud-page-list.css',
})
export class CrudPageListComponent implements OnInit {
  @Input() config!: CrudConfig;
  @Input() items: any[] = [];
  @Input() isLoading = false;

  showDeleteModal = false;
  itemToDelete: any = null;

  constructor(
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    if (!this.config) {
      throw new Error('CrudPageListComponent requer a propriedade "config"');
    }
  }

  /**
   * Formatar valor da célula
   */
  formatCell(column: CrudColumn, value: any): string {
    if (column.format) {
      return column.format(value);
    }
    return value || '-';
  }

  /**
   * Navegar para página de novo item
   */
  goToNew() {
    this.router.navigate([this.config.newPath]);
  }

  /**
   * Navegar para página de edição
   */
  goToEdit(item: any) {
    this.router.navigate([this.config.editPath, item.id]);
  }

  /**
   * Abrir modal de confirmação de delete
   */
  confirmDelete(item: any) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  /**
   * Cancelar delete
   */
  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  /**
   * Executar delete
   */
  async executeDelete() {
    if (!this.config.onDelete || !this.itemToDelete) return;

    this.loadingService.show();
    try {
      await this.config.onDelete(this.itemToDelete.id);
      this.showDeleteModal = false;
      this.itemToDelete = null;
    } finally {
      this.loadingService.hide();
    }
  }
}
