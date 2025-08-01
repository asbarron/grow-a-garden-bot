// src/utils/env.ts
import dotenv from 'dotenv'

dotenv.config()

export function loadEnv() {
  const required = ['TELEGRAM_TOKEN', 'CHAT_ID', 'TARGET_URL'] as const
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env: ${key}`)
    }
  }
}