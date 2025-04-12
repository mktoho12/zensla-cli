// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 3920, height: 2160 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: 'sessions/storageState.json',
  },
})
