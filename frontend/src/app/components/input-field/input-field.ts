import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'search';
type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'md';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() error: string = '';
  @Input() hint: string = '';
  @Input() icon: string | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() pattern: string | RegExp | null = null;
  @Input() control: AbstractControl<any> | null = null;
  @Input() showPassword: boolean = false;
  @Input() submitted: boolean = false;

  @Output() changed = new EventEmitter<string>();
  @Output() blurred = new EventEmitter<void>();
  @Output() focused = new EventEmitter<void>();

  value: string = '';

  get inputClasses(): string {
    const baseClasses = 'block w-full px-4 py-2 text-base rounded-lg transition-all duration-200 border';
    const sizeClasses = this.getSizeClasses();
    const borderClasses = this.getBorderClasses();
    const bgClasses = this.disabled ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800';
    const textClasses = this.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 dark:text-white';

    return `${baseClasses} ${sizeClasses} ${borderClasses} ${bgClasses} ${textClasses}`;
  }

  get containerClasses(): string {
    const baseClasses = 'relative w-full';
    return baseClasses;
  }

  private getSizeClasses(): string {
    const sizes: Record<InputSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };
    return sizes[this.size];
  }

  private getBorderClasses(): string {
    if (this.error) {
      return 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-800';
    }
    return 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:focus:ring-primary-800';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getInputType(): string {
    if (this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.changed.emit(this.value);
  }

  onFocus(): void {
    this.focused.emit();
  }

  onBlur(): void {
    this.blurred.emit();
  }
}
