import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`
      relative backdrop-blur-xl bg-white/5 border border-white/10 
      rounded-3xl p-5 md:p-8 shadow-2xl overflow-hidden
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none
      ${className}
    `}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-6 relative z-10">
          {title && <h3 className="text-xl font-bold text-white tracking-wide">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};