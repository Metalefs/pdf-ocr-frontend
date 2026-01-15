import React from 'react';
import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import Progress from './Progress';

describe('Progress', () => {
  it('renders status text and toggles logs visibility', () => {
    render(
      <Progress
        text="Working..."
        percent={42}
        logs={["line 1", "line 2"]}
        showLogs={true}
      />
    );

    expect(screen.getByText('Working...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show logs \(2\)/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /show logs/i }));
    expect(screen.getByText('line 1')).toBeInTheDocument();
    expect(screen.getByText('line 2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /hide logs/i }));
    expect(screen.getByRole('button', { name: /show logs \(2\)/i })).toBeInTheDocument();
  });

  it('sets alert role for error variant', () => {
    render(<Progress text="Boom" variant="error" logs={[]} showLogs={false} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
