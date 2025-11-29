import type { ReactNode } from 'react';
import type { ComponentType } from 'react';

interface ConfigSectionProps {
  title: string;
  Icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Config Section Component
 * Provides consistent styling for configuration panel sections
 */
export default function ConfigSection({
  title,
  Icon,
  children,
  className = ''
}: ConfigSectionProps) {
  return (
    <div className={`config-section ${className}`}>
      <div className="config-section-title">
        <Icon className="config-section-title-icon" />
        {title}
      </div>
      {children}
    </div>
  );
}
