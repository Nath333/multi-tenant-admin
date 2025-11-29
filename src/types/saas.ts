/**
 * SaaS-specific types for subscription, billing, and usage
 */

export interface PlanFeatures {
  maxDevices: number;
  maxUsers: number;
  maxApiCalls: number;
  maxStorage: number; // GB
  customDashboards: boolean;
  apiAccess: boolean;
  webhooks: boolean;
  ssoEnabled: boolean;
  prioritySupport: boolean;
  auditLogs: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: PlanFeatures;
  popular?: boolean;
}

export interface SubscriptionInfo {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
}

export interface UsageMetrics {
  devices: { current: number; limit: number };
  users: { current: number; limit: number };
  apiCalls: { current: number; limit: number };
  storage: { current: number; limit: number };
}

export interface Invoice {
  id: string;
  tenantId: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: Date;
  dueDate: Date;
  pdfUrl?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}
