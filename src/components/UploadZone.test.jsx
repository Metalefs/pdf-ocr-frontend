import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

import UploadZone from './UploadZone';
import { I18nProvider } from '../i18n';

function renderUploadZone(props) {
  return render(
    <I18nProvider defaultLocale="en">
      <UploadZone {...props} />
    </I18nProvider>
  );
}

describe('UploadZone', () => {
  it('calls onSelect for a valid PDF selected via input', () => {
    const onSelect = vi.fn();
    const { container } = renderUploadZone({ file: null, onSelect });

    const file = new File(['dummy'], 'doc.pdf', { type: 'application/pdf' });
    const input = container.querySelector('#fileInput');
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { files: [file] } });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(file);
  });

  it('does not call onSelect for a non-PDF file', () => {
    const onSelect = vi.fn();
    const { container } = renderUploadZone({ file: null, onSelect });

    const file = new File(['dummy'], 'doc.txt', { type: 'text/plain' });
    const input = container.querySelector('#fileInput');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('does not call onSelect when file exceeds 10MB', () => {
    const onSelect = vi.fn();
    const { container } = renderUploadZone({ file: null, onSelect });

    const file = new File(['dummy'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 10_000_001 });

    const input = container.querySelector('#fileInput');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('accepts a PDF dropped onto the zone', () => {
    const onSelect = vi.fn();
    renderUploadZone({ file: null, onSelect });

    const zone = document.getElementById('uploadZone');
    expect(zone).toBeTruthy();

    const file = new File(['dummy'], 'drop.pdf', { type: 'application/pdf' });
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(file);
  });
});
