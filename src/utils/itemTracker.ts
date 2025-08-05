import fs from 'fs-extra'
import path from 'path'
import { ITEM_TIMESTAMP_FILE, FOUR_HOUR_ITEMS, ONE_HOUR_ITEMS } from './constants'

interface ItemTimestamps {
  [item: string]: number
}

async function ensureCacheDirectory(): Promise<void> {
  const cacheDir = path.dirname(ITEM_TIMESTAMP_FILE)
  await fs.ensureDir(cacheDir)
}

async function readTimestamps(): Promise<ItemTimestamps> {
  try {
    await ensureCacheDirectory()
    return await fs.readJSON(ITEM_TIMESTAMP_FILE)
  } catch {
    return {}
  }
}

async function writeTimestamps(timestamps: ItemTimestamps): Promise<void> {
  await ensureCacheDirectory()
  await fs.writeJSON(ITEM_TIMESTAMP_FILE, timestamps, { spaces: 2 })
}

export function isTrackableItem(item: string): boolean {
  return FOUR_HOUR_ITEMS.has(item) || ONE_HOUR_ITEMS.test(item)
}

export async function shouldNotify(item: string): Promise<boolean> {
  if (!isTrackableItem(item)) {
    // Always notify non-trackable items (e.g. seeds) without any tracking
    return true
  }

  const timestamps = await readTimestamps()
  const now = Date.now()
  const lastSeen = timestamps[item] || 0
  const diffHours = (now - lastSeen) / (1000 * 60 * 60)

  if (FOUR_HOUR_ITEMS.has(item) && diffHours < 4) return false
  if (ONE_HOUR_ITEMS.test(item) && diffHours < 1) return false

  // Mark as notified immediately to prevent duplicate alerts
  timestamps[item] = now
  await writeTimestamps(timestamps)

  return true
}
