import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithRouter } from '../test/render';

// Keep App rendering lightweight by mocking AuthContext.
vi.mock('../contexts/AuthContext', () => {
  return {
    AuthProvider: ({ children }) => <>{children}</>,
    useAuth: () => ({
      user: null,
      credits: null,
      loading: false,
      signInWithGoogle: vi.fn(),
      signInWithGithub: vi.fn(),
      signOut: vi.fn(),
      refreshUser: vi.fn(async () => {}),
      updateProfile: vi.fn(async () => {}),
      userProfile: null,
    }),
  };
});

vi.mock('../services/pdf.service', () => {
  return {
    processPdfDemo: vi.fn(async () => ({ jobId: 'job-1' })),
    processPdfAsync: vi.fn(async () => ({ jobId: 'job-1' })),
  };
});

vi.mock('../services/jobs.service', () => {
  return {
    getJobStatus: vi.fn(async () => ({
      jobId: 'job-1',
      status: 'completed',
      progress: 100,
      logs: [],
      message: 'Completed',
    })),
    getJobDownloadUrl: vi.fn(() => 'http://example.test/download'),
  };
});

import App from '../App.jsx';
import { processPdfDemo } from '../services/pdf.service';
import { getJobStatus } from '../services/jobs.service';

describe('App home', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the improved sections in pt-BR locale', async () => {
    localStorage.setItem('locale', 'pt');
    renderWithRouter(<App />, { route: '/' });

    expect(await screen.findByRole('heading', { name: /por que isso existe\?/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /casos de uso da plataforma e da api/i })).toBeInTheDocument();
  });

  it('processes a selected PDF via demo flow and renders result', async () => {
    localStorage.setItem('locale', 'en');
    const user = userEvent.setup();

    const setIntervalSpy = vi
      .spyOn(globalThis, 'setInterval')
      .mockImplementation((fn) => {
        // Run polling callback immediately once.
        Promise.resolve().then(() => fn());
        return 1;
      });

    const clearIntervalSpy = vi
      .spyOn(globalThis, 'clearInterval')
      .mockImplementation(() => {});

    // mock download fetch
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(async () => {
      return {
        ok: true,
        blob: async () => new Blob(['pdf'], { type: 'application/pdf' }),
      };
    });

    const { container } = renderWithRouter(<App />, { route: '/' });

    const input = container.querySelector('#fileInput');
    expect(input).toBeTruthy();

    const file = new File(['dummy'], 'doc.pdf', { type: 'application/pdf' });
    await user.upload(input, file);

    const processBtn = screen.getByRole('button', { name: /process pdf/i });
    await user.click(processBtn);

    expect(processPdfDemo).toHaveBeenCalledTimes(1);

    // Wait for the polling callback to run and complete.
    expect(await screen.findByRole('link', { name: /download/i })).toBeInTheDocument();
    expect(getJobStatus).toHaveBeenCalled();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();

    globalThis.fetch = originalFetch;
  });
});
