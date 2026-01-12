// src/pages/PlansPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/payment.service';
import { stripePromise } from '../config/stripe';
import '../styles/plans.css';
import { useI18n } from '../i18n';

export default function PlansPage({ onNavigate }) {
  const { user, credits } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setError(null);
        const fetchedPlans = await paymentService.getPlans();
        setPlans(fetchedPlans);
      } catch (err) {
        setError(err.message || 'Failed to load plans');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleUpgrade = async (plan) => {
    if (!user) {
      alert('Please log in to upgrade your plan');
      return;
    }

    if (plan.id === 'free' || !plan.priceId) {
      alert('This plan does not support upgrading');
      return;
    }

    try {
      setCheckoutLoading(prev => ({ ...prev, [plan.id]: true }));
      
      const { sessionId, url } = await paymentService.createCheckoutSession(
        plan.id,
        plan.priceId
      );

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout');
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(prev => ({ ...prev, [plan.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="plans-container min-h-screen">
        <div className="loading-spinner">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="plans-page min-h-scree">
      <div className="plans-header">
        <h1 className='text-2xl font-semibold mb-4'>{t('plans.header')}</h1>
        <p>{t('plans.subtitle')}</p>
        {user && (
          <div className="current-plan-badge">
            Current Plan: <strong>{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</strong>
            {credits && <span className="credits-badge">{credits.credits} Credits</span>}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${user?.plan === plan.id ? 'active' : ''}`}>
            <div className="plan-header">
              <h2>{plan.name}</h2>
              <div className="plan-price">
                <span className="price-value">${plan.price}</span>
                <span className="price-period">/month</span>
              </div>
            </div>

            <div className="plan-credits">
              <span className="credits-amount">{plan.credits}</span>
              <span className="credits-label">Credits per month</span>
            </div>

            <div className="plan-features">
              <h3>Features:</h3>
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <span className="feature-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="plan-api p-4 text-sm text-slate-600">
              <strong>{t('plans.apiAccess')}:</strong>{' '}
              {plan.price && plan.price > 0 ? t('plans.apiIncludedYes') : t('plans.apiIncludedNo')}
            </div>

            <button
              className={`plan-button ${user?.plan === plan.id ? 'current' : 'upgrade'}`}
              onClick={() => handleUpgrade(plan)}
              disabled={
                checkoutLoading[plan.id] || 
                user?.plan === plan.id || 
                (plan.id === 'free' && user?.plan === 'free')
              }
            >
              {checkoutLoading[plan.id] ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : user?.plan === plan.id ? (
                'Current Plan'
              ) : plan.id === 'free' ? (
                'Downgrade to Free'
              ) : (
                'Upgrade Now'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="plans-faq">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4 className="italic">What are credits?</h4>
            <p>Credits are used to process PDFs through our OCR system. Each PDF processing costs credits based on the number of pages.</p>
          </div>
          <div className="faq-item">
            <h4 className="italic">Can I cancel anytime?</h4>
            <p>Yes! You can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
          </div>
          <div className="faq-item">
            <h4 className="italic">Do unused credits roll over?</h4>
            <p>Credits reset every month. Unused credits from the previous month do not carry over.</p>
          </div>
          <div className="faq-item">
            <h4 className="italic">What payment methods do you accept?</h4>
            <p>We accept all major credit and debit cards through our secure Stripe payment processor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
