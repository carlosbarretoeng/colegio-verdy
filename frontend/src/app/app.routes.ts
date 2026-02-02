import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './pages/login/login';
// import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Dashboard } from './pages/dashboard/dashboard';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { RootGuard } from './guards/root.guard';
import { UsersList } from './pages/users-list/users-list';
import { UsersNew } from './pages/users-new/users-new';
import { UsersEdit } from './pages/users-edit/users-edit';

export const routes: Routes = [
  // Rota raiz - redireciona baseado na autenticação
  { path: '', canActivate: [RootGuard], children: [] },

  // Rotas Públicas
  {
    path: '',
    children: [
      { path: 'login', component: Login, canActivate: [GuestGuard] },
      // { path: 'register', component: Register, canActivate: [GuestGuard] },
      { path: 'forgot-password', component: ForgotPassword, canActivate: [GuestGuard] },
    ]
  },
  
  // Rotas Restritas (com MainLayout e AuthGuard)
  {
    path: 'app',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      
      // Rotas de Usuários
      {
        path: 'users',
        children: [
          { path: 'list', component: UsersList },
          { path: 'new', component: UsersNew },
          { path: 'edit/:id', component: UsersEdit },
        ]
      },
      
      // Adicionar mais rotas restritas aqui
    ]
  },
  
  // Fallback
  { path: '**', redirectTo: '' }
];
