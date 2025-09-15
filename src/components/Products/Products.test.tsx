import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { Products } from './index';

// Mock Loader and CurrencyFormatter
vi.mock('../Loader', () => ({
  Loader: () => <div data-testid="loader" />,
}));
vi.mock('../CurrencyFormatter', () => ({
  CurrencyFormatter: ({ amount }: { amount: number }) => <span>{amount}</span>,
}));

// Define Product type locally for testing
type Product = {
  id: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
};

const mockProducts: Product[] = [
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

describe('Products', () => {
  beforeEach(() => {
    // Mock fetch to return mockProducts
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

  it('renders loader initially', () => {
    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

it('renders products after fetching', async () => {
  render(
    <BrowserRouter>
      <Products />
    </BrowserRouter>
  );

  // Wait for products to appear
  await waitFor(() => {
    expect(screen.getByText('Classic White T-Shirt')).toBeInTheDocument();
    expect(screen.getByText('Classic Black T-Shirt')).toBeInTheDocument();
  });

  // Check that prices render using regex to match the nested span
  expect(screen.getAllByText(/199\.99/)[0]).toBeInTheDocument();
  expect(screen.getAllByText(/199\.99/)[1]).toBeInTheDocument();
});


  it('renders error message on fetch failure', async () => {
    // Override fetch to fail
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false } as Response)));

    render(
      <BrowserRouter>
        <Products />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred when fetching data/i)
      ).toBeInTheDocument();
    });
  });
});
