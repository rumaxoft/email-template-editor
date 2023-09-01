import { render, screen } from '@testing-library/react'
import React from 'react'

import App from './App'

test('renders learn react link', () => {
  render(<App />)
  const button = screen.getByText(/^message editor$/i)
  const buttonWithTestData = screen.getByText(/message editor with test data/i)
  expect(button).toBeInTheDocument()
  expect(buttonWithTestData).toBeInTheDocument()
})
