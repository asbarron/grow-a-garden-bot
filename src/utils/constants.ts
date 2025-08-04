// src/utils/constants.ts

export const FLAG_KEYWORDS = (process.env.FLAG_KEYWORDS || '')
  .split(',')
  .map((keyword) => keyword.trim())

// Explicitly named items lasting 3 hours
export const THREE_HOUR_ITEMS = new Set([
  'Flat Canopy', 'Curved Canopy', 'Log', 'Large Wood Flooring',
  'Mini TV', 'Small Wood Arbour', 'Lamp Post', 'Frog Fountain',
  'Large Wood Arbour', 'Viney Ring Walkway'
])

// Regex pattern to match any item containing "egg" (case-insensitive)
export const ONE_HOUR_ITEMS = /egg/i

// Path to cached JSON file for timestamps
export const ITEM_TIMESTAMP_FILE = './cache/itemTimestamps.json'
