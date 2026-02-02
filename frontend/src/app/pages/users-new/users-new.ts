import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { UserService } from '../../services/user.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-users-new',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './users-new.html',
  styleUrl: './users-new.css',
})
export class UsersNew {
  form: FormGroup;
  submitted = false;
  errorMessage = '';

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'teacher', label: 'Professor' },
    { value: 'student', label: 'Aluno' },
    { value: 'staff', label: 'Funcionário' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.loadingService.show();
    try {
      await this.userService.createUser(this.form.value);
      this.router.navigate(['/app/users/list']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Erro ao criar usuário';
    } finally {
      this.loadingService.hide();
    }
  }

  goBack() {
    this.router.navigate(['/app/users/list']);
  }
}
