# 🌱 Grow a Garden Stock Checker Bot

This project monitors [Grow A Garden](https://www.roblox.com/games/126884695634066/Grow-a-Garden) item availability by scraping stock data from [growagardenstock](https:/growagardenstock.com). When flagged items are detected, it sends a notification via a [Telegram bot](https://telegram.me/BotFather).

---

## 🚀 Features

- Scrapes live stock data from `https://growagardenstock.com`
- Filters based on customizable `FLAG_KEYWORDS`
- Sends real-time Telegram alerts when target items are in stock
- Scheduled to run every 5 minutes via GitHub Actions
- Fully containerized and deployed using GitHub Container Registry

---

## 📦 Environment Variables

These should be set as GitHub Actions secrets:

| Variable           | Description                                                              |
|--------------------|--------------------------------------------------------------------------|
| `TELEGRAM_TOKEN`   | Telegram bot token from [@BotFather](https://telegram.me/BotFather)      |
| `CHAT_ID` | Your personal or group chat ID to receive alerts                         |
| `TARGET_URL`       | URL to scrape (default: `https://arcaiuz.com/grow-a-garden-stock`)       |
| `FLAG_KEYWORDS`    | Comma-separated list of keywords to look for. MUST be quoted.                             |
| `GHCR_TOKEN`       | GitHub Container Registry access token                                   |
| `GHCR_USERNAME`    | Your GitHub username for the container registry                          |

---

## 📂 GitHub Actions Workflows

### ⏰ Scheduled Stock Check

Runs every 5 minutes to check stock and send alerts via Telegram.  
👉🏽 [View `Scheduled Stock Check` workflow](https://github.com/asbarron/grow-a-garden-bot/blob/main/.github/workflows/scheduled-check.yaml)

---

### 🐳 Docker Image Build & Push

Builds and pushes the image to GHCR when main source files change.  
👉🏽 [View `Build and Push Docker Image` workflow](https://github.com/asbarron/grow-a-garden-bot/blob/main/.github/workflows/build-and-push.yaml)

---

## 🎯 Default Flag Keywords

These keywords are used to identify in-stock alerts (customizable via `FLAG_KEYWORDS`):


---

## ⚠️ Disclaimer

- This tool is **not affiliated** with Roblox or Grow A Garden.
- Use it for personal purposes only.
- The site `growagardenstock.com` must be functional for scraping to work.
