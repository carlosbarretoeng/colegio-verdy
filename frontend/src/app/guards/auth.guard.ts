import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { take, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Se autenticado, permitir acesso
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Aguardar o carregamento da sessão com timeout de 3 segundos
    try {
      const user = await this.authService.currentUser
        .pipe(
          timeout(3000), // Timeout de 3 segundos
          take(1)
        )
        .toPromise();

      if (user) {
        return true;
      }
    } catch (error) {
      // Se houver timeout ou erro, redirecionar para login
      console.log('Session check failed, redirecting to login');
    }

    // Não autenticado, redirecionar para login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
