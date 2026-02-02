import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { UserService, User } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-users-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './users-edit.html',
  styleUrl: './users-edit.css',
})
export class UsersEdit implements OnInit {
  form: FormGroup;
  submitted = false;
  errorMessage = '';
  isLoading = true;
  userId: string | null = null;

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'teacher', label: 'Professor' },
    { value: 'student', label: 'Aluno' },
    { value: 'staff', label: 'Funcionário' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      await this.loadUser();
    } else {
      this.router.navigate(['/app/users/list']);
    }
  }

  async loadUser() {
    this.isLoading = true;
    try {
      const user = await this.userService.getUserById(this.userId!);
      if (user) {
        this.form.patchValue(user);
      } else {
        this.router.navigate(['/app/users/list']);
      }
    } catch (error) {
      this.errorMessage = 'Erro ao carregar usuário';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid || !this.userId) {
      return;
    }

    this.loadingService.show();
    try {
      await this.userService.updateUser(this.userId, this.form.value);
      this.router.navigate(['/app/users/list']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao atualizar usuário';
    } finally {
      this.loadingService.hide();
    }
  }

  goBack() {
    this.router.navigate(['/app/users/list']);
  }
}
