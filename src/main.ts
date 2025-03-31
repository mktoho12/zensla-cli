import { areSetsEqual } from '@/lib/set-utils'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { chromium, Locator, Page } from 'playwright'

export const main = async (url: string) => {
  const browser = await chromium.launch()

  try {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/storageState.json',
    })

    const page = await context.newPage()
    await page.goto(url)

    const channelTab = page.getByRole('tab', { name: 'チャンネル' })
    if (await channelTab.isVisible()) {
      await channelTab.click()
    } else {
      await page.getByRole('tab', { name: 'その他' }).click()
      await page.getByRole('menuitemradio', { name: 'チャンネル' }).click()
    }

    await page.getByRole('button', { name: '並べ替え 最もおすすめ' }).click()
    await page.getByText('チャンネル（古→新）').click()

    const channels: Channel[] = []
    const maxPage = 9999
    for (let pageIndex = 0; pageIndex < maxPage; pageIndex++) {
      const channelsInPage = await collectChannelsInCurrentPage(page)
      channels.push(...channelsInPage)

      const nextButton = page.getByLabel('次のページ')
      if (!(await nextButton.isVisible())) {
        break
      }

      await nextButton.click()
    }

    const outputDir = 'out'
    if (!existsSync(outputDir)) {
      await mkdir(outputDir)
    }
    await writeFile(
      `${outputDir}/channels.json`,
      JSON.stringify(channels, null, 2),
    )
    console.log(`📦 チャンネル取得完了（${channels.length}件）`)
  } finally {
    await browser.close()
  }
}

const locateName = async (item: Locator): Promise<string> => {
  const name = item.locator('.c-channel_entity__name')
  const nameText = await name.textContent()
  return nameText?.trim() ?? ''
}

const locateMemberCount = async (item: Locator): Promise<number> => {
  const memberCount = item.locator(
    '[data-qa="browse_page_channel_member_count"]',
  )
  const memberCountText = await memberCount.textContent()
  const memberCountNumber = memberCountText?.match(/^([\d,]+)/)?.[1]
  return Number(memberCountNumber?.replace(/,/g, '')) // if not contain number, return NaN
}

const localePurpose = async (item: Locator): Promise<string | undefined> => {
  const purpose = item.locator('[data-qa="browse_page_channel_purpose"]')
  if (!(await purpose.isVisible())) {
    return undefined
  }

  const purposeText = await purpose.textContent()
  return purposeText?.trim()
}

interface Channel {
  id: string
  name: string
  memberCount: number
  purpose?: string
}

const collectChannelsInCurrentPage = async (page: Page): Promise<Channel[]> => {
  const list = page.getByLabel('チャンネルの検索結果')
  const listItems = list.getByRole('listitem')
  await listItems.nth(0).waitFor()

  const maxScrolls = 100
  const seen: Set<string> = new Set<string>()
  let prevSeen: Set<string> = new Set<string>()

  const channels: Channel[] = []

  for (let pageIndex = 0; pageIndex < maxScrolls; pageIndex++) {
    const count = await listItems.count()

    for (let i = 0; i < count; i++) {
      const el = listItems.nth(i)
      if (i + 1 === count) {
        await el.scrollIntoViewIfNeeded()
      }
      const name = await locateName(el)
      const memberCount = await locateMemberCount(el)
      const purpose = await localePurpose(el)
      if (name && !seen.has(name)) {
        const id = await el.getAttribute('id')
        if (!id) {
          throw new Error(`Channel ID not found for ${name}`)
        }
        if (!seen.has(id)) {
          console.debug(`${id} ${name} (${memberCount} members)`)
          channels.push({ id, name, memberCount, purpose })
        }
        seen.add(id)
      }
    }

    if (areSetsEqual(seen, prevSeen)) {
      break
    }

    prevSeen = new Set(seen)
    await page.waitForTimeout(300)
  }

  return channels
}
