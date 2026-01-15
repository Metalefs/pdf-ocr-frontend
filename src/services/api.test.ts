import { describe, it, expect, beforeEach } from 'vitest';
import { getAcceptLanguageHeaderValue, withLanguageHeaders } from './api';

describe('services/api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns pt-BR Accept-Language when locale is pt', () => {
    localStorage.setItem('locale', 'pt');
    expect(getAcceptLanguageHeaderValue()).toMatch(/pt-BR/i);
  });

  it('returns en-first Accept-Language when locale is en', () => {
    localStorage.setItem('locale', 'en');
    expect(getAcceptLanguageHeaderValue()).toMatch(/^en/i);
  });

  it('adds Accept-Language header if missing', () => {
    localStorage.setItem('locale', 'en');
    const init = withLanguageHeaders({ headers: {} });
    const headers = new Headers(init.headers);
    expect(headers.get('Accept-Language')).toBeTruthy();
  });

  it('does not override Accept-Language if already provided', () => {
    const init = withLanguageHeaders({ headers: { 'Accept-Language': 'fr-FR' } });
    const headers = new Headers(init.headers);
    expect(headers.get('Accept-Language')).toBe('fr-FR');
  });
});
