// src/services/payment.service.ts
import { supabase } from './auth.service';
import { CheckoutRequest, PlanDto } from '../config/stripe';
import { withLanguageHeaders } from './api';

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000';

class PaymentService {
  /**
   * Fetch available plans from the backend
   */
  async getPlans(): Promise<PlanDto[]> {
    const response = await fetch(`${API_BASE}/api/payment/plans`, withLanguageHeaders());
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  }

  /**
   * Create a Stripe checkout session
   */
  async createCheckoutSession(planId: string, priceId: string): Promise<{ sessionId: string; url: string }> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const currentUrl = new URL(window.location.href);
    const successUrl = new URL('/account?payment=success', currentUrl.origin).toString();
    const cancelUrl = new URL('/plans', currentUrl.origin).toString();

    const checkoutRequest: CheckoutRequest = {
      planId,
      priceId,
      successUrl,
      cancelUrl,
    };

    const response = await fetch(`${API_BASE}/api/payment/checkout`, {
      method: 'POST',
      headers: withLanguageHeaders({
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
      body: JSON.stringify(checkoutRequest),
    });

    if (!response.ok) throw new Error('Failed to create checkout session');
    return response.json();
  }

  /**
   * Handle Stripe redirect after checkout
   */
  async handleCheckoutCallback(sessionId: string): Promise<any> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE}/api/payment/checkout/${sessionId}`, {
      headers: withLanguageHeaders({
        headers: {
          Authorization: `Bearer ${session.data.session.access_token}`,
        },
      }).headers,
    });

    if (!response.ok) throw new Error('Failed to retrieve checkout session');
    return response.json();
  }
}

export const paymentService = new PaymentService();
