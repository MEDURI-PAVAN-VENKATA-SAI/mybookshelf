import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../contexts/ThemeContext';


export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const {darkMode} = useTheme();
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-[var(--card)] hover:bg-[var(--hover)] text-[var(--card-text)] shadow-md hover:shadow-lg',
    outline: `border-2 border-indigo-500 text-indigo-500 ${ darkMode ? "hover:bg-[var(--secondary)]":"hover:bg-indigo-50"}`,
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
