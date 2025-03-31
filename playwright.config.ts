// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    browserName: 'chromium',
    headless: false,
    viewport: { width: 1960, height: 1080 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: 'tests/fixtures/storageState.json',
  },
})
