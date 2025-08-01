// src/services/telegram.ts
import { fetch } from 'undici'

export async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_TOKEN
  const chatId = process.env.CHAT_ID

  if (!token || !chatId) {
    throw new Error('Missing TELEGRAM_TOKEN or CHAT_ID')
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    })
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('❌ Telegram send error:', err)
  } else {
    console.log('📨 Telegram alert sent!')
  }
}
