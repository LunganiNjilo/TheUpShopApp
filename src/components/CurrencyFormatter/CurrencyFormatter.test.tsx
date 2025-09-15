import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CurrencyFormatter } from "./index"

describe('CurrencyFormatter', () => {
  it('renders correctly amounts formatted as ZAR, e.g. R100.23', () => {
    render(<CurrencyFormatter amount={100.23} />)
    
    // Match the correct South African currency format
    expect(screen.getByText(/R\s*100,23/)).toBeVisible()
  })
})
