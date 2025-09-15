import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TotalPrice } from "./index"

describe('TotalPrice', () => {
  it('renders correctly total price amount formatted as ZAR, e.g. R 100,23', () => {
    render(<TotalPrice amount={100.23} />)

    // Match the exact SA currency format with space and comma
    expect(screen.getByText(/R\s100,23/i)).toBeVisible()
  })
})
