import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { LogoComponent } from '../../components/logo/logo';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, LogoComponent, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit, AfterViewInit {
  isDrawerOpen = false;
  currentUser$;

  menuItems = [
    { label: 'Dashboard', route: '/app/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Sistema', children: [
      { label: 'Usuários', route: '/app/users/list', icon: 'fas fa-users' },
      { label: 'Perfis', route: '/app/roles', icon: 'fas fa-user-shield' },
    ], icon: 'fas fa-cogs' },
  ]

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit(): void {
    initFlowbite();
    this.setupDrawerListener();
  }

  ngAfterViewInit(): void {
    initFlowbite();
  }

  ngAfterViewChecked(): void {
    initFlowbite();
  }

  setupDrawerListener(): void {
    const drawer = document.getElementById('drawer-navigation');
    if (drawer) {
      const observer = new MutationObserver(() => {
        this.isDrawerOpen = !drawer.classList.contains('-translate-x-full');
      });
      observer.observe(drawer, { attributes: true, attributeFilter: ['class'] });
    }
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  async onLogout(): Promise<void> {
    try {
      this.loadingService.show();
      await this.authService.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  public generateDropdownSidebarId(label: string): string {
    console.log('Generating ID for label:', label);
    return `dropdown-sidebar-${('' + label  ).toLowerCase().replace(' ', '_')}`;
  }
}
