// src/services/scraper.ts
import { createBrowserContext } from '../utils/browser'
import { shouldNotify } from '../utils/itemTracker'
import { FLAG_KEYWORDS } from '../utils/constants'

export async function scrapeShopData(): Promise<Record<string, Set<string>>> {
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
    return { 'No Items Found': new Set() }
  }

  const items = new Set<string>(
    await page.$$eval('span.text-base.font-medium', (spans) =>
      spans.map((span) => span.textContent?.trim() || 'Unknown')
    )
  )

  const flaggedItems = new Set<string>()
  for (const item of items) {
    if (FLAG_KEYWORDS.includes(item) && (await shouldNotify(item))) {
      flaggedItems.add(item)
    }
  }

  await context.close()

  return {
    'Live Shop Items': items,
    'Flagged Items': flaggedItems
  }
}