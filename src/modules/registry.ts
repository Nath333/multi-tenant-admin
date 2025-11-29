/**
 * Module Registry
 * Central registry for all feature modules
 */

import type { ModuleConfig } from './types';

const modules: ModuleConfig[] = [];

export function getAllModules(): ModuleConfig[] {
  return modules;
}

export function registerModule(module: ModuleConfig): void {
  modules.push(module);
}
