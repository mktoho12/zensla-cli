import { format } from 'date-fns-tz'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { chromium, Locator, Page } from 'playwright'

interface Message {
  channel: { id: string | null; name?: string }
  sender: { id: string | null; name?: string }
  timestamp: number
  message?: string
}

export const fetchDay = async (
  url: string,
  date: string,
  storageStatePath: string,
  outputDir: string = 'out',
) => {
  const browser = await chromium.launch()

  const messages: Message[] = []

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 3240 },
      storageState: storageStatePath,
    })

    const page = await context.newPage()
    await page.goto(url)

    // 検索窓をクリック
    await page.locator('#search-text').click()

    await page
      .getByRole('combobox', { name: '検索' })
      .fill(`on:${date} -is:dm -in:#１年_13クラス`)
    await page.locator('#c-search_autcomplete__suggestion_0').click()

    // await page.goto('https://app.slack.com/client/T085SRUUM8W/search')
    // 「並べ替え：◯◯◯」のボタンをテキストの一部一致で取得してクリック
    await page.getByRole('button', { name: /^並べ替え : / }).click()
    await page.getByRole('option', { name: '投稿日順' }).locator('div').click()

    const hasNextPageButton = async (page: Page) => {
      const nextPageButton = page.locator(
        'button[data-qa="c-pagination_forward_btn"]',
      )

      const result =
        (await nextPageButton.isVisible()) && (await nextPageButton.isEnabled())
      if (result) {
        await nextPageButton.click()
        await page.waitForTimeout(100) // ページ遷移のための待機
      }

      return result
    }

    do {
      const messagesLocator = page.locator(
        '[role="document"][aria-roledescription="message"]',
      )

      await messagesLocator.last().waitFor({ state: 'visible' })

      const count = await messagesLocator.count()
      for (let i = 0; i < count; i++) {
        const messageLocator = messagesLocator.nth(i)
        const message = await readMessage(messageLocator)
        messages.push(message)
      }
    } while (await hasNextPageButton(page))
  } catch (error) {
    console.error('Error occurred:', error)
    throw error
  } finally {
    if (!existsSync(outputDir)) {
      await mkdir(outputDir)
    }
    await writeFile(
      `${outputDir}/messages/${date}.json`,
      JSON.stringify(messages, null, 2),
    )
    console.log(`📦 メッセージ取得完了（${messages.length}件）`)

    await browser.close()
  }
}

const readMessage = async (messageLocator: Locator): Promise<Message> => {
  const channelId = await messageLocator
    .locator('span[data-qa="search_result_channel_name"] span[data-channel-id]')
    .getAttribute('data-channel-id')

  const channelName = await messageLocator
    .locator('span[data-qa="search_result_channel_name"]')
    .textContent()

  const senderId = await messageLocator
    .locator('[data-message-sender]')
    .getAttribute('data-message-sender')

  const senderName = await messageLocator
    .locator('[data-message-sender]')
    .textContent()

  const timestamp = await messageLocator
    .locator('[data-ts]')
    .getAttribute('data-ts')

  // const message = await messageLocator
  //   .locator('[data-qa="message-text"],[data-qa="search_message_body"]') // アーカイブしたときのシステムメッセージはqaが変わるっぽい
  //   .textContent()
  //   .catch(() => null)

  const result = {
    channel: { id: channelId, name: channelName?.trim() },
    sender: { id: senderId, name: senderName?.trim() },
    timestamp: Number(timestamp),
    // message: message?.trim(),
  }

  const date = new Date(Number(timestamp) * 1000)
  const time = format(date, 'HH:mm:ss', { timeZone: 'Asia/Tokyo' })
  console.log(`${time} ${result.channel.name} ${result.sender.name}`)

  return result
}
