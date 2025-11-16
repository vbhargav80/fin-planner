import React from 'react';

interface PersonTabsPanelProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const PersonTabsPanel: React.FC<PersonTabsPanelProps> = ({ className = '', children }) => {
  return (
    <div className={`border-l-4 border-indigo-500 bg-white p-4 shadow-sm border border-gray-200 rounded-r-lg ${className}`}>
      <div>
        {children}
      </div>
    </div>
  );
};

export default PersonTabsPanel;
