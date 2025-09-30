import React from 'react';

export function Card({
  title,
  subtitle,
  value,
  icon,
  className = '',
  children
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-white shadow-custom rounded-lg p-4 flex items-start space-x-4 ${className}`}
    >
      <div className="flex-1">
        <h3 className="text-2xl font-semibold text-gray-800 flex gap-2 items-center mb-2">
          {icon}
          {title}
        </h3>
        {subtitle && <p className="text-gray-600 mb-2">{subtitle}</p>}

        <p className="text-2xl font-bold text-gray-800">{value}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
