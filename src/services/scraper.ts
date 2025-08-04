// src/services/scraper.ts
import { createBrowserContext } from '../utils/browser'
import { FLAG_KEYWORDS } from '../utils/constants'

export async function scrapeShopData(): Promise<Set<string>> {
  const context = await createBrowserContext()
  const page = await context.newPage()
  await page.goto(process.env.TARGET_URL!, { waitUntil: 'domcontentloaded' })

  const maxRetries = 15
  const delay = 2000
  let found = false

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const elements = await page.$$('span.text-base.font-medium')
    if (elements.length > 0) {
      found = true
      break
    }
    console.log(`⏳ Waiting for items... attempt ${attempt}/${maxRetries}`)
    await page.waitForTimeout(delay)
  }

  if (!found) {
    console.warn('⚠️ No items found after retrying.')
    await context.close()
    return new Set()
  }

  const allItems = await page.$$eval('span.text-base.font-medium', (spans) =>
    spans.map((span) => span.textContent?.trim() || 'Unknown')
  )

  await context.close()

  return new Set(allItems.filter((item) => FLAG_KEYWORDS.includes(item)))
}
