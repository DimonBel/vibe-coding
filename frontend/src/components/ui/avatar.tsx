import * as React from 'react';

export function Avatar({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 font-bold ${className}`}>
      {children}
    </span>
  );
}

export function AvatarFallback({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 