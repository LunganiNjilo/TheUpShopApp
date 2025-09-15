import { fireEvent, render, screen, within  } from '@testing-library/react'
import { afterEach, beforeEach,beforeAll, describe, expect, it } from 'vitest'

import { Cart } from "./index"
import { BrowserRouter } from 'react-router-dom'


beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', {
    value: () => {},
    writable: true,
  });
});

describe('Cart', () => {
  beforeEach(() => {
    localStorage.setItem('cart', JSON.stringify({"b1a7d2f0-0002-4b10-9aee-123456789002":{"id":"b1a7d2f0-0002-4b10-9aee-123456789002","sku":"SKU-0002","name":"Classic Black T-Shirt","price":199.99,"availableQuantity":40,"imageUrl":"/images/products/SKU-0002.jpg","featured":true,"onSpecial":false,"quantity":1},"b1a7d2f0-0003-4b10-9aee-123456789003":{"id":"b1a7d2f0-0003-4b10-9aee-123456789003","sku":"SKU-0003","name":"Blue Jeans","price":499.99,"availableQuantity":30,"imageUrl":"/images/products/SKU-0003.jpg","featured":false,"onSpecial":false,"quantity":1},"b1a7d2f0-0004-4b10-9aee-123456789004":{"id":"b1a7d2f0-0004-4b10-9aee-123456789004","sku":"SKU-0004","name":"Red Hoodie","price":399.99,"availableQuantity":25,"imageUrl":"/images/products/SKU-0004.webp","featured":true,"onSpecial":true,"quantity":1},"b1a7d2f0-0011-4b10-9aee-123456789011":{"id":"b1a7d2f0-0011-4b10-9aee-123456789011","sku":"SKU-0011","name":"White Sneakers","price":749.99,"availableQuantity":30,"imageUrl":"/images/products/SKU-0011.avif","featured":false,"onSpecial":false,"quantity":1}}))
    render(<BrowserRouter><Cart /></BrowserRouter>)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders correctly when empty', async () => {
    expect(screen.getByText(/Total:/i)).toBeVisible()
  })

  it('should render the items from localStorage', () => {
    expect(screen.getByText('Classic Black T-Shirt')).toBeInTheDocument()
    expect(screen.getByText('Blue Jeans')).toBeInTheDocument()
    expect(screen.getByText('Red Hoodie')).toBeInTheDocument()
    expect(screen.getByText('White Sneakers')).toBeInTheDocument()
  })

it('removes products from the cart', async () => {
  const redHoodieRow = screen.getByText('Red Hoodie').closest('div')
  expect(redHoodieRow).toBeInTheDocument()

  // Find the minus button and click it
  const minusButton = within(redHoodieRow!).getByDisplayValue('-')
  fireEvent.click(minusButton)

  // Assert the product is removed from the DOM
  expect(screen.queryByText('Red Hoodie')).not.toBeInTheDocument()
})


it('updates the quantity of products in the cart', async () => {
  const blueJeansRow = screen.getByText('Blue Jeans').closest('div')
  expect(blueJeansRow).toBeInTheDocument()

  const plusButton = within(blueJeansRow!).getByDisplayValue('+')
  const quantityInput = within(blueJeansRow!).getByRole('spinbutton') as HTMLInputElement

  // Initial quantity
  expect(quantityInput.value).toBe('1')

  // Click plus button
  fireEvent.click(plusButton)

  // Quantity should increase
  expect(quantityInput.value).toBe('2')

  // Check total price numerically (robust against formatting)
  const totalPriceText = screen.getByText(/Total:/).textContent!
  const totalPriceNumber = parseFloat(
    totalPriceText.replace(/[^\d,]/g, '').replace(',', '.')
  )
  expect(totalPriceNumber).toBeCloseTo(2349.95) // new total after increment
})

  it('calculates the total price correctly', () => {
    expect(screen.getByText('Total:'))
    expect(screen.getByText(/R\s*1\s*849,96/)).toBeInTheDocument()
  })
})
