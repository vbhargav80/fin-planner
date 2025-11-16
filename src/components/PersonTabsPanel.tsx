import React from 'react';

interface PersonTabsPanelProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const PersonTabsPanel: React.FC<PersonTabsPanelProps> = ({ title, className = '', children }) => {
  return (
    <div className={`border border-gray-200 rounded-lg bg-white p-4 shadow-sm ${className}`}>
      {title && (
        <div className="block text-sm font-medium text-gray-700 mb-1">{title}</div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};

export default PersonTabsPanel;

