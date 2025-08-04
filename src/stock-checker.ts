import { scrapeShopData } from './services/scraper'
import { sendTelegramAlert } from './services/telegram'
import { shouldNotify, isTrackableItem } from './utils/itemTracker'

export async function runStockChecker() {
  const flaggedItems = await scrapeShopData()

  console.log('📦 Flagged items returned from scraper:', Array.from(flaggedItems))

  let alertsSent = 0

  for (const item of flaggedItems) {
    if (!isTrackableItem(item)) {
      console.log(`🚫 Skipping untracked item: ${item}`)
      continue
    }

    if (await shouldNotify(item)) {
      const msg = `🌱 *${item}* is now in stock!`
      console.log('🚨 Sending alert:', msg)
      await sendTelegramAlert(msg)
      alertsSent++
    } else {
      console.log(`⏳ Skipping recently seen item: ${item}`)
    }
  }

  if (alertsSent === 0) {
    console.log('🔍 No new alerts this run.')
  }

  console.log('✅ Stock check complete.')
}
