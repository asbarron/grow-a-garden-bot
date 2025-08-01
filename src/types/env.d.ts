// src/types/env.d.ts

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        TELEGRAM_TOKEN: string
        CHAT_ID: string
        TARGET_URL: string
        FLAG_KEYWORDS?: string // comma-separated list of items to watch for
      }
    }
  }
  
  export {}