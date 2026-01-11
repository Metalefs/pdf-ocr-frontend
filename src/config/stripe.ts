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
  price: number;
  credits: number;
  priceId?: string;
  features: string[];
}
