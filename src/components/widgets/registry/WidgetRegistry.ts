import type {
  WidgetRegistration,
  WidgetRegistryMap,
  WidgetFilter,
  WidgetCategory,
} from './widgetRegistry.types';

/**
 * WidgetRegistry - Central registry for all widget types
 * Manages widget registration, discovery, and instantiation
 */
class WidgetRegistry {
  private registry: WidgetRegistryMap = new Map();
  private static instance: WidgetRegistry;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): WidgetRegistry {
    if (!WidgetRegistry.instance) {
      WidgetRegistry.instance = new WidgetRegistry();
    }
    return WidgetRegistry.instance;
  }

  /**
   * Register a new widget type
   */
  register(registration: WidgetRegistration): void {
    const { metadata } = registration;

    if (this.registry.has(metadata.id)) {
      console.warn(`Widget "${metadata.id}" is already registered. Overwriting.`);
    }

    this.registry.set(metadata.id, registration);
    console.log(`✓ Registered widget: ${metadata.name} (${metadata.id})`);
  }

  /**
   * Register multiple widgets at once
   */
  registerBatch(registrations: WidgetRegistration[]): void {
    registrations.forEach((registration) => this.register(registration));
  }

  /**
   * Unregister a widget
   */
  unregister(widgetId: string): boolean {
    return this.registry.delete(widgetId);
  }

  /**
   * Get a widget registration by ID
   */
  get(widgetId: string): WidgetRegistration | undefined {
    return this.registry.get(widgetId);
  }

  /**
   * Check if a widget is registered
   */
  has(widgetId: string): boolean {
    return this.registry.has(widgetId);
  }

  /**
   * Get all registered widgets
   */
  getAll(): WidgetRegistration[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get all widget IDs
   */
  getAllIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get widgets by category
   */
  getByCategory(category: WidgetCategory): WidgetRegistration[] {
    return this.getAll().filter((widget) => widget.metadata.category === category);
  }

  /**
   * Get widgets by tag
   */
  getByTag(tag: string): WidgetRegistration[] {
    return this.getAll().filter(
      (widget) => widget.metadata.tags && widget.metadata.tags.includes(tag)
    );
  }

  /**
   * Search widgets by name or description
   */
  search(query: string): WidgetRegistration[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(
      (widget) =>
        widget.metadata.name.toLowerCase().includes(lowerQuery) ||
        widget.metadata.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter widgets with multiple criteria
   */
  filter(filter: WidgetFilter): WidgetRegistration[] {
    let results = this.getAll();

    if (filter.category) {
      results = results.filter((widget) => widget.metadata.category === filter.category);
    }

    if (filter.tags && filter.tags.length > 0) {
      results = results.filter((widget) =>
        filter.tags?.some((tag) => widget.metadata.tags?.includes(tag))
      );
    }

    if (filter.search) {
      const lowerQuery = filter.search.toLowerCase();
      results = results.filter(
        (widget) =>
          widget.metadata.name.toLowerCase().includes(lowerQuery) ||
          widget.metadata.description.toLowerCase().includes(lowerQuery) ||
          widget.metadata.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return results;
  }

  /**
   * Get all unique categories
   */
  getCategories(): WidgetCategory[] {
    const categories = new Set<WidgetCategory>();
    this.getAll().forEach((widget) => categories.add(widget.metadata.category));
    return Array.from(categories);
  }

  /**
   * Get all unique tags
   */
  getTags(): string[] {
    const tags = new Set<string>();
    this.getAll().forEach((widget) => {
      widget.metadata.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  /**
   * Get widget count
   */
  count(): number {
    return this.registry.size;
  }

  /**
   * Clear all registrations (mainly for testing)
   */
  clear(): void {
    this.registry.clear();
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    total: number;
    byCategory: Record<string, number>;
    topTags: Array<{ tag: string; count: number }>;
  } {
    const widgets = this.getAll();
    const byCategory: Record<string, number> = {};
    const tagCounts = new Map<string, number>();

    widgets.forEach((widget) => {
      // Count by category
      const category = widget.metadata.category;
      byCategory[category] = (byCategory[category] || 0) + 1;

      // Count tags
      widget.metadata.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    const topTags = Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: widgets.length,
      byCategory,
      topTags,
    };
  }
}

// Export singleton instance
export const widgetRegistry = WidgetRegistry.getInstance();

// Export class for testing purposes
export { WidgetRegistry };
