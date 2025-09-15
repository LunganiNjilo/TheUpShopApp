import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import App from './App';

// Mock products returned by API
const mockProducts = [
  {
    id: '1',
    sku: 'SKU-0001',
    name: 'Classic White T-Shirt',
    price: 199.99,
    imageUrl: '/images/products/SKU-0001.webp',
  },
  {
    id: '2',
    sku: 'SKU-0002',
    name: 'Classic Black T-Shirt',
    price: 199.99,
    imageUrl: '/images/products/SKU-0002.jpg',
  },
];

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response)
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders header, footer, and products correctly', async () => {
    render(<App />); // <-- no BrowserRouter here

    // Header
    expect(screen.getByAltText(/The UpShop Application/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Go to Cart/i)).toBeInTheDocument();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Classic White T-Shirt')).toBeInTheDocument();
      expect(screen.getByText('Classic Black T-Shirt')).toBeInTheDocument();
    });

    // Footer
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });
});
