// src/config/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLIC_KEY;

export const stripePromise = loadStripe(stripePublishableKey);

export interface CheckoutRequest {
  planId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PlanDto {
  id: string;
  name: string;
  description?: string;
  priceId?: string;
  price: number;
  currency?: string;
  interval?: string;
  credits: number;
  features?: PlanFeatures | string[];
  popular?: boolean;
  order?: number;
}

export interface PlanFeatures {
  basicProcessing?: boolean;
  priorityProcessing?: boolean;
  maxProcessing?: boolean;
  emailSupport?: boolean;
  prioritySupport?: boolean;
  support24x7?: boolean;
  apiAccess?: boolean;
  unlimitedApi?: boolean;
  webhooks?: boolean;
  advancedDashboard?: boolean;
  customReports?: boolean;
}
