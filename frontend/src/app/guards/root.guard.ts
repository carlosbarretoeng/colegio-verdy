import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, take, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RootGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Se autenticado, ir para dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
      return false;
    }

    // Aguardar o carregamento da sessão com timeout de 3 segundos
    try {
      const user = await this.authService.currentUser
        .pipe(
          timeout(3000),
          filter(u => u !== null),
          take(1)
        )
        .toPromise();

      if (user) {
        this.router.navigate(['/app/dashboard']);
        return false;
      }
    } catch (error: any) {
      if (error.name === 'TimeoutError') {
        console.log('Session check timeout, redirecting to login');
      }
    }

    // Não autenticado, ir para login
    this.router.navigate(['/login']);
    return false;
  }
}
