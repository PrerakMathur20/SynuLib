import React from 'react';

export interface ButtonLabelProps {
  children?: React.ReactNode;
}

export const ButtonLabel: React.FC<ButtonLabelProps> = ({ children }) => {
  return <span className="button-label">{children}</span>;
};
ButtonLabel.displayName = 'ButtonLabel';

