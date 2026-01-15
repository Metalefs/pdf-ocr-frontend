import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { materialTheme } from '../theme';

export function renderWithRouter(ui: React.ReactElement, opts?: { route?: string }) {
  const route = opts?.route ?? '/';
  return render(
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ThemeProvider>
  );
}
