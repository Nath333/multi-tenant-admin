/**
 * Reusable Form Field Components
 * Eliminates ~5-10 lines of duplicate code per field across config panels
 *
 * These components wrap Ant Design form elements with consistent styling,
 * validation, and change handling
 */

import { Form, Input, InputNumber, Select, Switch } from 'antd';
import type { ReactNode } from 'react';

// ============================================================================
// Base Props
// ============================================================================

interface BaseFieldProps {
  label: string;
  required?: boolean;
  help?: string;
  className?: string;
}

// ============================================================================
// TextField Component
// ============================================================================

interface TextFieldProps extends BaseFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  maxLength,
  help,
  className,
}: TextFieldProps) {
  return (
    <Form.Item
      label={label}
      required={required}
      help={help}
      className={className}
    >
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
      />
    </Form.Item>
  );
}

// ============================================================================
// NumberField Component
// ============================================================================

interface NumberFieldProps extends BaseFieldProps {
  value?: number;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  unit?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  required = false,
  disabled = false,
  unit,
  help,
  className,
}: NumberFieldProps) {
  return (
    <Form.Item
      label={label}
      required={required}
      help={help}
      className={className}
    >
      <InputNumber
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        addonAfter={unit}
        style={{ width: '100%' }}
      />
    </Form.Item>
  );
}

// ============================================================================
// SelectField Component
// ============================================================================

export interface SelectOption {
  label: string;
  value: string | number;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SelectFieldProps extends BaseFieldProps {
  value?: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  showSearch?: boolean;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
  allowClear = false,
  showSearch = false,
  help,
  className,
}: SelectFieldProps) {
  return (
    <Form.Item
      label={label}
      required={required}
      help={help}
      className={className}
    >
      <Select
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear}
        showSearch={showSearch}
      >
        {options.map((option) => (
          <Select.Option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

// ============================================================================
// SwitchField Component
// ============================================================================

interface SwitchFieldProps extends BaseFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  checkedChildren?: ReactNode;
  unCheckedChildren?: ReactNode;
}

export function SwitchField({
  label,
  checked,
  onChange,
  disabled = false,
  checkedChildren,
  unCheckedChildren,
  help,
  className,
}: SwitchFieldProps) {
  return (
    <Form.Item
      label={label}
      help={help}
      className={className}
      style={{ marginBottom: 0 }}
    >
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
    </Form.Item>
  );
}

// ============================================================================
// TextAreaField Component
// ============================================================================

interface TextAreaFieldProps extends BaseFieldProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  help,
  className,
}: TextAreaFieldProps) {
  return (
    <Form.Item
      label={label}
      required={required}
      help={help}
      className={className}
    >
      <Input.TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
      />
    </Form.Item>
  );
}
