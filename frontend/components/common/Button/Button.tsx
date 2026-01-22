import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    iconOnly?: boolean;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    iconOnly = false,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        iconOnly ? styles.iconOnly : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button className={classNames} {...props}>
            {children}
        </button>
    );
}
