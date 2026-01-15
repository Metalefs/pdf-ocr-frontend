import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import Result from './Result';
import { I18nProvider } from '../i18n';

describe('Result', () => {
  it('renders download link and triggers reset', () => {
    const onReset = vi.fn();
    render(
      <I18nProvider defaultLocale="en">
        <Result url="blob:result" fileName="doc.pdf" onReset={onReset} />
      </I18nProvider>
    );

    expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    const download = screen.getByRole('link', { name: /download/i });
    expect(download).toHaveAttribute('href', 'blob:result');

    fireEvent.click(screen.getByRole('button', { name: /another/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
