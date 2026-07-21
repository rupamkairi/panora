import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './integration',
  outputDir: './integration/.output/test-results',
  timeout: 30 * 1000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  // One's production server keeps route rendering state in-process; exercising
  // different routes concurrently can cross-contaminate SSR responses.
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:8081',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun run dev',
    cwd: '../..',
    url: 'http://localhost:8081',
    reuseExistingServer: true,
    timeout: 60_000,
  },

  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
})
