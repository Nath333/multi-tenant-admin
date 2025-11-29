/**
 * Module System Types
 */

export interface ModuleConfig {
  id: string;
  name: string;
  icon: string;
  path: string;
  component: React.ComponentType;
  description: string;
  order?: number;
}
