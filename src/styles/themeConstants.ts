/**
 * Centralized UI Theme Constants
 *
 * This file contains all reusable style constants to ensure consistency
 * across the application and improve performance by avoiding style object recreation.
 */

// ============================================================================
// COLORS
// ============================================================================

export const COLORS = {
  // Primary gradient
  primary: {
    start: '#667eea',
    end: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },

  // Background gradients
  background: {
    page: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
    card: 'linear-gradient(to bottom, #ffffff, #fafbfc)',
    header: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    headerAlt: 'linear-gradient(to right, #ffffff, #f8fafc)',
    filterSection: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
  },

  // Text colors
  text: {
    primary: '#1a202c',
    secondary: '#64748b',
    tertiary: '#8c8c8c',
    muted: '#999',
  },

  // Borders
  border: {
    light: '#e2e8f0',
    lighter: 'rgba(226, 232, 240, 0.8)',
    lightest: 'rgba(226, 232, 240, 0.6)',
  },

  // Status colors
  status: {
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
  },

  // Tag colors
  tag: {
    blue: 'blue',
    green: 'green',
    red: 'red',
    orange: 'orange',
    purple: 'purple',
    cyan: 'cyan',
    magenta: 'magenta',
    geekblue: 'geekblue',
    volcano: 'volcano',
    default: 'default',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  xxxxl: 32,
} as const;

export const PADDING = {
  page: '20px 24px',
  card: 24,
  cardCompact: 18,
  section: '28px 32px',
  modal: '24px',
  modalHeader: '20px 24px',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
  xxxl: 16,
  round: 20,
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const FONT_SIZE = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 15,
  xxl: 16,
  xxxl: 18,
  title: 20,
  heading: 28,
} as const;

export const FONT_WEIGHT = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const LETTER_SPACING = {
  tight: '-0.5px',
  normal: '-0.3px',
  base: '0',
} as const;

export const LINE_HEIGHT = {
  tight: 1.4,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.7,
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const SHADOWS = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
  md: '0 2px 8px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 12px rgba(0, 0, 0, 0.08)',
  xl: '0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
  button: '0 4px 12px rgba(102, 126, 234, 0.4)',
  buttonHover: '0 8px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(102, 126, 234, 0.2)',
  top: '0 -2px 8px rgba(0, 0, 0, 0.05)',
} as const;

// ============================================================================
// DIMENSIONS
// ============================================================================

export const DIMENSIONS = {
  button: {
    height: 44,
    heightCompact: 40,
  },
  icon: {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
  },
  badge: {
    sm: 40,
    md: 44,
    lg: 48,
  },
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const TRANSITIONS = {
  fast: 'all 0.2s ease',
  normal: 'all 0.3s ease',
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 0.3s',
} as const;

// ============================================================================
// COMPONENT STYLES (Reusable Style Objects)
// ============================================================================

// Page container
export const PAGE_CONTAINER_STYLE = {
  padding: PADDING.page,
  background: COLORS.background.page,
  minHeight: 'calc(100vh - 64px)',
} as const;

// Page header
export const PAGE_HEADER_STYLE = {
  marginBottom: SPACING.xxxl,
  padding: PADDING.section,
  background: COLORS.background.header,
  borderRadius: BORDER_RADIUS.xxxl,
  border: `1px solid ${COLORS.border.light}`,
  boxShadow: SHADOWS.lg,
} as const;

// Page title
export const PAGE_TITLE_STYLE = {
  margin: 0,
  fontSize: FONT_SIZE.heading,
  fontWeight: FONT_WEIGHT.bold,
  color: COLORS.text.primary,
  letterSpacing: LETTER_SPACING.tight,
} as const;

// Page description
export const PAGE_DESCRIPTION_STYLE = {
  margin: '12px 0 0 0',
  fontSize: FONT_SIZE.lg,
  color: COLORS.text.secondary,
  fontWeight: FONT_WEIGHT.medium,
  lineHeight: LINE_HEIGHT.relaxed,
} as const;

// Primary button
export const PRIMARY_BUTTON_STYLE = {
  borderRadius: BORDER_RADIUS.lg,
  height: DIMENSIONS.button.height,
  paddingLeft: SPACING.xxl,
  paddingRight: SPACING.xxl,
  fontWeight: FONT_WEIGHT.semibold,
  fontSize: FONT_SIZE.lg,
  background: COLORS.primary.gradient,
  border: 'none',
  boxShadow: SHADOWS.button,
} as const;

// Secondary button
export const SECONDARY_BUTTON_STYLE = {
  borderRadius: BORDER_RADIUS.lg,
  height: DIMENSIONS.button.height,
  paddingLeft: SPACING.xl,
  paddingRight: SPACING.xl,
  fontWeight: FONT_WEIGHT.medium,
  fontSize: FONT_SIZE.lg,
  boxShadow: SHADOWS.sm,
  border: `2px solid ${COLORS.border.light}`,
} as const;

// ProTable card style
export const PRO_TABLE_STYLE = {
  borderRadius: BORDER_RADIUS.xxxl,
  overflow: 'hidden',
  boxShadow: SHADOWS.xl,
  border: `1px solid ${COLORS.border.lighter}`,
  background: COLORS.background.card,
} as const;

// ProTable table style
export const PRO_TABLE_TABLE_STYLE = {
  borderRadius: BORDER_RADIUS.xl,
} as const;

// Card style
export const CARD_STYLE = {
  borderRadius: BORDER_RADIUS.xxxl,
  border: `1px solid ${COLORS.border.light}`,
  boxShadow: SHADOWS.md,
  background: COLORS.background.card,
} as const;

// Card hoverable
export const CARD_HOVERABLE_STYLE = {
  ...CARD_STYLE,
  transition: TRANSITIONS.smooth,
} as const;

// Modal header style
export const MODAL_HEADER_STYLE = {
  padding: PADDING.modalHeader,
  borderBottom: `1px solid ${COLORS.border.light}`,
  background: COLORS.background.headerAlt,
} as const;

// Modal body style
export const MODAL_BODY_STYLE = {
  padding: PADDING.modal,
} as const;

// Modal title style
export const MODAL_TITLE_STYLE = {
  fontSize: FONT_SIZE.xxxl,
  fontWeight: FONT_WEIGHT.bold,
  color: COLORS.text.primary,
  letterSpacing: LETTER_SPACING.normal,
} as const;

// Modal OK button props
export const MODAL_OK_BUTTON_PROPS = {
  style: {
    background: COLORS.primary.gradient,
    border: 'none',
    borderRadius: BORDER_RADIUS.md,
    height: DIMENSIONS.button.heightCompact,
    fontWeight: FONT_WEIGHT.semibold,
    boxShadow: SHADOWS.button,
  },
} as const;

// Modal Cancel button props
export const MODAL_CANCEL_BUTTON_PROPS = {
  style: {
    borderRadius: BORDER_RADIUS.md,
    height: DIMENSIONS.button.heightCompact,
    border: `2px solid ${COLORS.border.light}`,
    fontWeight: FONT_WEIGHT.medium,
  },
} as const;

// Table header title style
export const TABLE_HEADER_TITLE_STYLE = {
  fontSize: FONT_SIZE.title,
  fontWeight: FONT_WEIGHT.bold,
  color: COLORS.text.primary,
  letterSpacing: LETTER_SPACING.normal,
  marginBottom: SPACING.xs + 2,
} as const;

// Table header subtitle style
export const TABLE_HEADER_SUBTITLE_STYLE = {
  fontSize: FONT_SIZE.md,
  color: COLORS.text.secondary,
  fontWeight: FONT_WEIGHT.medium,
  lineHeight: LINE_HEIGHT.normal,
} as const;

// Total count style (pagination)
export const TOTAL_COUNT_STYLE = {
  fontWeight: FONT_WEIGHT.semibold,
  color: COLORS.text.secondary,
} as const;

// Icon badge style
export const createIconBadgeStyle = (badgeColor: string) => ({
  width: DIMENSIONS.badge.md,
  height: DIMENSIONS.badge.md,
  borderRadius: BORDER_RADIUS.xl,
  background: badgeColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: DIMENSIONS.icon.xl,
  boxShadow: SHADOWS.button,
} as const);

// Filter section style
export const FILTER_SECTION_STYLE = {
  marginBottom: SPACING.xxxl,
  padding: `${SPACING.xl}px ${SPACING.xxl}px`,
  background: COLORS.background.filterSection,
  borderRadius: BORDER_RADIUS.xxxl,
  border: `1px solid ${COLORS.border.light}`,
  boxShadow: SHADOWS.sm,
} as const;

// Empty state style
export const EMPTY_STATE_STYLE = {
  padding: '100px 40px',
  background: COLORS.background.card,
  borderRadius: BORDER_RADIUS.round,
  border: `2px dashed ${COLORS.border.light}`,
  boxShadow: SHADOWS.sm,
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get status color based on percentage
 */
export const getProgressColor = (percent: number): string => {
  if (percent >= 90) return COLORS.status.error;
  if (percent >= 75) return COLORS.status.warning;
  return COLORS.status.success;
};

/**
 * Get load color based on percentage
 */
export const getLoadColor = (percent: number): string => {
  if (percent < 70) return COLORS.status.success;
  if (percent < 90) return COLORS.status.warning;
  return COLORS.status.error;
};

/**
 * Create icon style with color
 */
export const createIconStyle = (color: string, size: number = DIMENSIONS.icon.md) => ({
  marginRight: SPACING.lg,
  color,
  fontSize: size,
} as const);

/**
 * Create badge count style
 */
export const createBadgeStyle = () => ({
  backgroundColor: COLORS.primary.start,
  fontSize: FONT_SIZE.md,
  fontWeight: FONT_WEIGHT.semibold,
  padding: `6px ${SPACING.xxxl}px`,
  height: 'auto',
  borderRadius: BORDER_RADIUS.round,
  boxShadow: SHADOWS.button,
} as const);
