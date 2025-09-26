#!/usr/bin/env node

import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { chromium } from 'playwright'

export const saveStorageState = async (
  sessionFile = 'sessions/storageState.json',
) => {
  const sessionDir = sessionFile.substring(0, sessionFile.lastIndexOf('/'))

  // セッションディレクトリが存在しない場合は作成
  if (!existsSync(sessionDir)) {
    await mkdir(sessionDir, { recursive: true })
  }

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  console.log('ブラウザが開きました。Slack にログインしてください。')
  console.log(
    'ログインが完了したら、このターミナルに戻って Enter を押してください。',
  )

  await page.goto('https://slack.com', { timeout: 120000 })
  await new Promise((resolve) => {
    process.stdin.once('data', resolve)
  })

  await context.storageState({ path: sessionFile })
  console.log(`ログイン状態が保存されました: ${sessionFile}`)

  await browser.close()
}
