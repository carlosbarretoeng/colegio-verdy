import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, take, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Se já está autenticado, redirecionar para dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/app/dashboard']);
      return false;
    }

    // Aguardar o carregamento da sessão com timeout de 3 segundos
    try {
      const user = await this.authService.currentUser
        .pipe(
          timeout(3000), // Timeout de 3 segundos
          filter(u => u !== null), // Aguardar até que haja um usuário
          take(1)
        )
        .toPromise();

      if (user) {
        this.router.navigate(['/app/dashboard']);
        return false;
      }
    } catch (error: any) {
      // Se houver timeout ou erro, continuar permitindo acesso (provavelmente não autenticado)
      if (error.name === 'TimeoutError') {
        console.log('Session check timeout, allowing guest access');
      }
    }

    // Não autenticado, permitir acesso à rota pública
    return true;
  }
}
