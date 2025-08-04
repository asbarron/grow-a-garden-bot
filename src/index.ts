// src/index.ts
import { runStockChecker } from './stock-checker'
import { loadEnv } from './utils/env'

loadEnv()

runStockChecker()
  .then(() => {
    console.log('✅ Finished stock check. Exiting...')
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Stock checker failed:', err)
    process.exit(1)
  })
