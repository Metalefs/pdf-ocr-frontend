import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import ErrorBox from './ErrorBox';

describe('ErrorBox', () => {
  it('renders message and details', () => {
    render(<ErrorBox message="Something failed" details="More info" />);
    expect(screen.getByText('Something failed')).toBeInTheDocument();
    expect(screen.getByText('More info')).toBeInTheDocument();
  });

  it('renders retry and upgrade actions and triggers retry', () => {
    const onRetry = vi.fn();
    render(
      <ErrorBox
        message="Rate limited"
        onRetry={onRetry}
        retryLabel="Try again"
        upgradeUrl="/plans"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    const upgrade = screen.getByRole('link', { name: /upgrade plan/i });
    expect(upgrade).toHaveAttribute('href', '/plans');
  });
});
