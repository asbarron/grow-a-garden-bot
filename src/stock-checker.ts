import { scrapeShopData } from './services/scraper'
import { sendTelegramAlert } from './services/telegram'
import { shouldNotify } from './utils/itemTracker'

export async function runStockChecker() {
  const flaggedItems = await scrapeShopData()

  console.log('📦 Flagged items returned from scraper:', Array.from(flaggedItems))

  let alertsSent = 0

  for (const item of flaggedItems) {
    if (await shouldNotify(item)) {
      const msg = `🌱 *${item}* is now in stock!`
      console.log('🚨 Sending alert:', msg)

      try {
        await sendTelegramAlert(msg)
        alertsSent++
      } catch (err) {
        console.error(`❌ Failed to send alert for ${item}:`, err)
      }

    } else {
      console.log(`⏳ Skipping recently seen item: ${item}`)
    }
  }

  if (alertsSent === 0) {
    console.log('🔍 No new alerts this run.')
  }

  console.log('✅ Stock check complete.')
}
