import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false }) => {
  return (
    <div 
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        rounded-xl shadow-sm border border-gray-100 dark:border-gray-700
        ${hoverable ? 'transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;