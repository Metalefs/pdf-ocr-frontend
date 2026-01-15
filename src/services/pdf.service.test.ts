import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock auth.service used by processPdfAsync
vi.mock('./auth.service', () => {
  return {
    authService: {
      refreshUserData: vi.fn(),
    },
    supabase: {
      auth: {
        getSession: vi.fn(async () => ({
          data: {
            session: {
              access_token: 'token',
            },
          },
        })),
      },
    },
  };
});

import { processPdfDemo, processPdfAsync } from './pdf.service';

describe('services/pdf.service', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('maps network errors to API_UNAVAILABLE for demo endpoint', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down');
    }) as any;

    await expect(processPdfDemo(new File(['x'], 'a.pdf'))).rejects.toMatchObject({
      code: 'API_UNAVAILABLE',
      status: 0,
    });
  });

  it('maps 500 responses to API_UNAVAILABLE for demo endpoint', async () => {
    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        status: 500,
        statusText: 'Server error',
        json: async () => ({ error: 'boom' }),
      } as any;
    }) as any;

    await expect(processPdfDemo(new File(['x'], 'a.pdf'))).rejects.toMatchObject({
      code: 'API_UNAVAILABLE',
      status: 500,
    });
  });

  it('maps demo limit to DEMO_LIMIT and includes upgradeUrl fallback', async () => {
    globalThis.fetch = vi.fn(async () => {
      return {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ error: 'Demo limit exceeded' }),
      } as any;
    }) as any;

    await expect(processPdfDemo(new File(['x'], 'a.pdf'))).rejects.toMatchObject({
      code: 'DEMO_LIMIT',
      upgradeUrl: '/plans',
      status: 429,
    });
  });

  it('requires authentication for processPdfAsync when session is missing', async () => {
    const authModule: any = await import('./auth.service');
    authModule.supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null } });

    await expect(processPdfAsync(new File(['x'], 'a.pdf'))).rejects.toThrow(/not authenticated/i);
  });
});
