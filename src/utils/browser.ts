// src/utils/browser.ts
import { chromium, BrowserContext } from 'playwright'

export async function createBrowserContext(): Promise<BrowserContext> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  })

  return browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  })
}
