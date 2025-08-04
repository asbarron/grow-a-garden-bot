// src/utils/itemTracker.ts
import fs from 'fs-extra'
import { ITEM_TIMESTAMP_FILE, THREE_HOUR_ITEMS, ONE_HOUR_ITEMS } from './constants'

interface ItemTimestamps {
  [item: string]: number
}

async function readTimestamps(): Promise<ItemTimestamps> {
  try {
    return await fs.readJSON(ITEM_TIMESTAMP_FILE)
  } catch {
    return {}
  }
}

async function writeTimestamps(timestamps: ItemTimestamps): Promise<void> {
  await fs.writeJSON(ITEM_TIMESTAMP_FILE, timestamps, { spaces: 2 })
}

export function isTrackableItem(item: string): boolean {
  return THREE_HOUR_ITEMS.has(item) || ONE_HOUR_ITEMS.test(item)
}

export async function shouldNotify(item: string): Promise<boolean> {
  const timestamps = await readTimestamps()
  const now = Date.now()

  const lastSeen = timestamps[item] || 0
  const diffHours = (now - lastSeen) / (1000 * 60 * 60)

  if (THREE_HOUR_ITEMS.has(item) && diffHours < 3) return false
  if (ONE_HOUR_ITEMS.test(item) && diffHours < 1) return false

  timestamps[item] = now
  await writeTimestamps(timestamps)

  return true
}
