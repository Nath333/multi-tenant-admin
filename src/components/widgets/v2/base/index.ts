/**
 * Base Widget Components Barrel Export
 * Provides convenient import path for reusable widget components
 *
 * Usage:
 *   import { ElementListManager, ConfigPanelLayout, TextField } from '../base';
 */

// Existing Components
export { default as ConfigurableWidget } from './ConfigurableWidget';
export { default as DataBindingForm } from './DataBindingForm';
export { default as ConfigSection } from './ConfigSection';
export { default as EmptyStateWithAdd } from './EmptyStateWithAdd';

// New Reusable Components
export { default as ConfigPanelLayout } from './ConfigPanelLayout';
export { default as ElementListManager } from './ElementListManager';

// Element Header Components
export {
  ElementHeader,
  StatusBadges,
  ElementHeaderWithBadges,
  InfoTag,
  CountTag,
  TypeTag,
} from './ElementHeader';

// Nested Table Editor (for columns, circuits, etc.)
export {
  default as NestedTableEditor,
  type ColumnDefinition,
  type NestedItem,
} from './NestedTableEditor';

// Column Definition Helpers
export {
  textColumn,
  numberColumn,
  switchColumn,
  selectColumn,
} from './columnHelpers';

// Form Field Components
export {
  TextField,
  NumberField,
  SelectField,
  SwitchField,
  TextAreaField,
  type SelectOption,
} from './FormFields';

// Specialized Field Components
export {
  ColorPickerField,
  LayoutSelector,
  TimeRangeSelector,
  ChartTypeSelector,
} from './SpecializedFields';
