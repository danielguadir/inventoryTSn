// test-setup.ts
//import '@testing-library/jest-dom'

import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

import * as matchers from '@testing-library/jest-dom/matchers'

// Extiende Vitest's expect con los matchers de testing-library
expect.extend(matchers)

// Limpia el DOM después de cada test
afterEach(() => {
  cleanup()
})
