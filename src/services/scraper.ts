// src/services/scraper.ts
import { chromium } from 'playwright'

export async function scrapeShopData(): Promise<Record<string, Set<string>>> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage'
    ]
  })

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  })

  const page = await context.newPage()
  await page.goto(process.env.TARGET_URL!, { waitUntil: 'domcontentloaded' })

  const maxRetries = 15
  const delay = 2000
  let found = false

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const cards = await page.$$('.stock-item-card')
    if (cards.length > 0) {
      found = true
      break
    }
    console.log(`⏳ Waiting for stock... attempt ${attempt}/${maxRetries}`)
    await page.waitForTimeout(delay)
  }

  if (!found) {
    console.warn('⚠️ No stock found after retrying for 30 seconds.')
    await browser.close()
    return { 'No Items Found': new Set() }
  }

  const items = new Set<string>(
    await page.$$eval('.stock-item-card', cards => {
      return cards.map(card => {
        const rawSpan = card.querySelector('span.text-white')
        if (!rawSpan) return 'Unknown'

        const fullText = rawSpan.textContent?.trim() || ''
        return fullText.replace(/\s*\d+x?$/i, '').trim()
      })
    })
  )

  await browser.close()
  return {
    'Live Shop Items': items
  }
}
