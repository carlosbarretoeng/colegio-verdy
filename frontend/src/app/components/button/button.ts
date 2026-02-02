import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'purple' | 'pink' | 'green' | 'red' | 'blue' | 'yellow';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() outline: boolean = false;
  @Input() pill: boolean = false;
  @Input() icon: string | null = null;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth: boolean = false;
  @Input() shadow: boolean = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-4';
    const sizeClasses = this.getSizeClasses();
    const colorClasses = this.getColorClasses();
    const radiusClasses = this.pill ? 'rounded-full' : 'rounded-lg';
    const widthClasses = this.fullWidth ? 'w-full' : '';
    const shadowClasses = this.shadow ? 'shadow-lg' : '';
    const disabledClasses = this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer';

    return `${baseClasses} ${sizeClasses} ${colorClasses} ${radiusClasses} ${widthClasses} ${shadowClasses} ${disabledClasses}`;
  }

  private getSizeClasses(): string {
    // Se é um icon-only button, usar tamanhos quadrados
    if (this.icon && !this.label) {
      const iconSizes: Record<ButtonSize, string> = {
        xs: 'p-1.5 text-xs',
        sm: 'p-2 text-sm',
        md: 'p-2.5 text-base',
        lg: 'p-3 text-lg',
        xl: 'p-3.5 text-xl',
      };
      return iconSizes[this.size];
    }

    // Para buttons com texto
    const sizes: Record<ButtonSize, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-3.5 text-xl',
    };
    return sizes[this.size];
  }

  private getColorClasses(): string {
    const colors: Record<ButtonColor, { filled: string; outline: string }> = {
      primary: {
        filled: 'bg-primary-700 text-white focus:ring-primary-300 dark:bg-primary-600 dark:focus:ring-primary-800',
        outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50 dark:border-primary-500 dark:text-primary-500',
      },
      secondary: {
        filled: 'bg-gray-700 text-white focus:ring-gray-300 dark:bg-gray-600 dark:focus:ring-gray-800',
        outline: 'border-2 border-gray-700 text-gray-700 hover:bg-gray-50 dark:border-gray-500 dark:text-gray-500',
      },
      success: {
        filled: 'bg-green-700 text-white focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800',
        outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-500',
      },
      danger: {
        filled: 'bg-red-700 text-white focus:ring-red-300 dark:bg-red-600 dark:focus:ring-red-800',
        outline: 'border-2 border-red-700 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-500',
      },
      warning: {
        filled: 'bg-yellow-400 text-white focus:ring-yellow-300 dark:bg-yellow-500 dark:focus:ring-yellow-800',
        outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-500',
      },
      info: {
        filled: 'bg-cyan-700 text-white focus:ring-cyan-300 dark:bg-cyan-600 dark:focus:ring-cyan-800',
        outline: 'border-2 border-cyan-700 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-500 dark:text-cyan-500',
      },
      dark: {
        filled: 'bg-gray-900 text-white focus:ring-gray-300 dark:bg-gray-800 dark:focus:ring-gray-700',
        outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-700',
      },
      light: {
        filled: 'bg-white text-gray-900 border border-gray-300 focus:ring-gray-300 dark:bg-gray-800 dark:text-white dark:border-gray-600',
        outline: 'border-2 border-gray-200 text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200',
      },
      purple: {
        filled: 'bg-purple-700 text-white focus:ring-purple-300 dark:bg-purple-600 dark:focus:ring-purple-800',
        outline: 'border-2 border-purple-700 text-purple-700 hover:bg-purple-50 dark:border-purple-500 dark:text-purple-500',
      },
      pink: {
        filled: 'bg-pink-700 text-white focus:ring-pink-300 dark:bg-pink-600 dark:focus:ring-pink-800',
        outline: 'border-2 border-pink-700 text-pink-700 hover:bg-pink-50 dark:border-pink-500 dark:text-pink-500',
      },
      green: {
        filled: 'bg-green-700 text-white focus:ring-green-300 dark:bg-green-600 dark:focus:ring-green-800',
        outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-500',
      },
      red: {
        filled: 'bg-red-700 text-white focus:ring-red-300 dark:bg-red-600 dark:focus:ring-red-800',
        outline: 'border-2 border-red-700 text-red-700 hover:bg-red-50 dark:border-red-500 dark:text-red-500',
      },
      blue: {
        filled: 'bg-blue-700 text-white focus:ring-blue-300 dark:bg-blue-600 dark:focus:ring-blue-800',
        outline: 'border-2 border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500',
      },
      yellow: {
        filled: 'bg-yellow-400 text-white focus:ring-yellow-300 dark:bg-yellow-500 dark:focus:ring-yellow-800',
        outline: 'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-50 dark:border-yellow-500 dark:text-yellow-500',
      },
    };

    const colorStyle = colors[this.color];
    return this.outline ? colorStyle.outline : colorStyle.filled;
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
