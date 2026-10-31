import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('sandbox landing page', () => {
  it('introduces the service marketplace with accessible page landmarks', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /good games.*great teammates/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /how it works/i })).toHaveAttribute(
      'href',
      '#how-it-works',
    );
  });
  it('clearly discloses sandbox status without offering deposits or wallet connection', () => {
    render(<Home />);
    expect(
      screen.getByText(/no real money.*no wallet connection/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /deposit|connect wallet|pay/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /sandbox arena/i }),
    ).toBeInTheDocument();
  });
});
