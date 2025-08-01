// src/stock-checker.ts
import { scrapeShopData } from './services/scraper'
import { sendTelegramAlert } from './services/telegram'

export async function runStockChecker() {
  const flagged = (process.env.FLAG_KEYWORDS || '')
    .split(',')
    .map(k => k.trim().replace(/^['"]|['"]$/g, '').toLowerCase())
    .filter(Boolean)

  console.log('✅ Flagged keywords:', flagged)

  const stock = await scrapeShopData()

  console.log('📦 Shop data:')
  for (const [shop, items] of Object.entries(stock)) {
    console.log(`- ${shop} (${items.size} items)`)
  }

  let alertsSent = 0

  for (const [shopName, items] of Object.entries(stock)) {
    for (const item of items) {
      const normalized = item.toLowerCase()

      if (flagged.some(keyword => normalized.includes(keyword))) {
        const msg = `🌱 *${item}* found in *${shopName}*`
        console.log('🚨 Sending alert:', msg)
        await sendTelegramAlert(msg)
        alertsSent++
      }
    }
  }

  if (alertsSent === 0) {
    console.log('🔍 No flagged items found this run.')
  }

  console.log('✅ Stock check complete.')
}
