import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import type { Theme } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import type { Routine } from './features/routines/routineReducer';

export interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: MemoryRouterProps['initialEntries'];
  initialRoutines?: Routine[];
  initialTheme?: Theme;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: ExtendedRenderOptions,
) {
  const {
    initialEntries = ['/'],
    initialRoutines,
    initialTheme,
    ...renderOptions
  } = options || {};

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider initialTheme={initialTheme}>
          <RoutineProvider initialRoutines={initialRoutines}>
            {children}
          </RoutineProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
