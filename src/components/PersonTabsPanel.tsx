import React from 'react';

interface PersonTabsPanelProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const PersonTabsPanel: React.FC<PersonTabsPanelProps> = ({ className = '', children }) => {
  return (
    <div className={`border border-gray-200 rounded-lg bg-white p-4 shadow-sm ${className}`}>
      <div>
        {children}
      </div>
    </div>
  );
};

export default PersonTabsPanel;

