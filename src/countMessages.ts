import { existsSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { chromium, Page } from 'playwright'
import { Channel } from './fetchChannelList'

export const countMessages = async (url: string, storageStatePath: string) => {
  const browser = await chromium.launch()

  try {
    const context = await browser.newContext({
      storageState: storageStatePath,
    })

    const channelsJSON = await readFile('out/channels.json', {
      encoding: 'utf-8',
      flag: 'r',
    })
    const channels = JSON.parse(channelsJSON) as Channel[]

    const page = await context.newPage()
    await page.goto(url)

    for (const channel of channels) {
      // 検索をクリアする
      const clearButton = page.getByRole('button', { name: '検索をクリアする' })
      if (await clearButton.isVisible()) {
        await clearButton.click()
      }

      // 検索窓をクリック
      await page.locator('#search-text').click()

      // 検索窓にチャンネル名を入力
      // 例: 「in: #general」
      await page
        .getByRole('combobox', { name: '検索' })
        .fill(`in: ${channel.name}`)
      await page.waitForTimeout(100)

      // 最初の候補をクリック
      // チャンネル名が完全に一致するものが一番上に来るはずなのでこれでいいハズ…
      await page.locator('#c-search_autcomplete__suggestion_0').click()
      await page.waitForTimeout(100)

      // 件数を取得
      // 1万件を超えると「1万」のように表示されるので、これは手動で取得するしかない……
      const messageCount = await locateMessageCount(page)

      channel.messageCount = messageCount
      console.log(`${channel.name}: ${messageCount.toLocaleString()} messages`)
    }

    // JSONファイルに書き込む
    const outputDir = 'out'
    if (!existsSync(outputDir)) {
      await mkdir(outputDir)
    }
    await writeFile(
      `${outputDir}/channels.json`,
      JSON.stringify(channels, null, 2),
    )
  } finally {
    await browser.close()
  }
}

/**
 * Locate the message count on the page.
 * @param page The Playwright page object.
 * @returns The number of messages as a Promise.
 */
const locateMessageCount = async (page: Page): Promise<number> => {
  const memberCount = page.locator(
    'button[data-qa="search_tab_messages"] [data-qa="tabs_item_render_count"]',
  )
  const memberCountText = await memberCount.textContent()
  return Number(memberCountText?.replace(/,/g, '').trim()) // if not contain number, return NaN
}
