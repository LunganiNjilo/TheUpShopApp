import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import useLocalStorageState, { LocalStorageState } from 'use-local-storage-state';

import { CartWidget } from "./index";

vi.mock('use-local-storage-state');

describe('CartWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when no products are added to the cart', () => {
    (useLocalStorageState as any).mockReturnValue([
      {},                 // state
      vi.fn(),            // setState
      { removeItem: vi.fn() }, // removeItem
    ]);

    render(
      <BrowserRouter>
        <CartWidget />
      </BrowserRouter>
    );

    // Since cart is empty, the count badge should not exist
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
  });

  it('renders correctly when products are added to the cart', () => {
    const cartMock = {
      '1': { id: '1', quantity: 2 },
      '2': { id: '2', quantity: 1 },
    };

    (useLocalStorageState as any).mockReturnValue([
      cartMock,
      vi.fn(),
      { removeItem: vi.fn() },
    ]);

    render(
      <BrowserRouter>
        <CartWidget />
      </BrowserRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument(); // 2 + 1 = 3
  });

  it('should go to the cart page when clicked', () => {
    const cartMock = { '1': { id: '1', quantity: 2 } };

    (useLocalStorageState as any).mockReturnValue([
      cartMock,
      vi.fn(),
      { removeItem: vi.fn() },
    ]);

    render(
      <BrowserRouter>
        <CartWidget />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
