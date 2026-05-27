import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'signal' | 'outline-signal';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-elevated border border-border-hover text-[#EAEAEF] hover:bg-[#1A1A20] hover:border-border-hover',
  secondary: 'bg-surface border border-border-subtle text-secondary hover:text-[#EAEAEF] hover:border-border-hover',
  ghost: 'bg-transparent border border-transparent text-secondary hover:text-[#EAEAEF] hover:bg-elevated',
  danger: 'bg-warning/10 border border-warning/30 text-warning hover:bg-warning/20',
  signal: 'bg-signal/10 border border-signal/30 text-signal hover:bg-signal/20',
  'outline-signal': 'bg-transparent border border-signal/50 text-signal hover:bg-signal/10 hover:border-signal',
};

const sizes: Record<ButtonSize, string> = {
  xs: 'h-6 px-2 text-[10px] gap-1',
  sm: 'h-8 px-3 text-[12px] gap-1.5',
  md: 'h-9 px-4 text-[13px] gap-2',
  lg: 'h-11 px-6 text-[15px] gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-mono font-medium rounded',
        'transition-all duration-150 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:ring-1 focus-visible:ring-signal/50',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
