import { areSetsEqual } from '@/lib/set-utils'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { chromium, Locator, Page } from 'playwright'

export const fetchChannelList = async (
  url: string,
  storageStatePath: string,
  outputDir: string = 'out',
) => {
  const browser = await chromium.launch()

  const channels: Channel[] = []

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 3240 },
      storageState: storageStatePath,
    })

    const page = await context.newPage()
    await page.goto(url)

    await page.getByRole('treeitem', { name: 'ディレクトリ' }).click()
    await page.getByRole('tab', { name: 'チャンネル' }).click()

    await page.getByRole('button', { name: '並べ替え 最もおすすめ' }).click()
    await page.getByText('チャンネル（古→新）').click()

    const maxPage = 9999
    for (let pageIndex = 0; pageIndex < maxPage; pageIndex++) {
      await page.waitForTimeout(300)
      const channelsInPage = await collectChannelsInCurrentPage(page)
      channels.push(...channelsInPage)

      const nextButton = page.getByLabel('次のページ')
      if (!(await nextButton.isVisible()) || !(await nextButton.isEnabled())) {
        break
      }

      await nextButton.click()
    }
  } catch (error) {
    console.error('Error occurred:', error)
    throw error
  } finally {
    if (!existsSync(outputDir)) {
      await mkdir(outputDir)
    }
    await writeFile(
      `${outputDir}/channels.json`,
      JSON.stringify(channels, null, 2),
    )
    console.log(`📦 チャンネル取得完了（${channels.length}件）`)

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
export interface Channel {
  id: string
  name: string
  memberCount: number
  purpose?: string
  messageCount?: number
}

const collectChannelsInCurrentPage = async (page: Page): Promise<Channel[]> => {
  const list = page.getByLabel('チャンネルの検索結果')
  const listItems = list.getByRole('listitem')
  await listItems.last().waitFor()

  const maxScrolls = 100
  const seen: Set<string> = new Set<string>()
  let prevSeen: Set<string> = new Set<string>()

  const channels: Channel[] = []

  for (let pageIndex = 0; pageIndex < maxScrolls; pageIndex++) {
    const count = await listItems.count()

    for (let i = 0; i < count; i++) {
      const el = listItems.nth(i)
      const isVisible = await el.isVisible()
      if (!isVisible) {
        console.debug(`Item ${i} is not visible`)
        continue
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

    const scrollAreas = await page
      .locator('[data-qa="slack_kit_scrollbar"]')
      .all()
    const scrollArea = scrollAreas.at(1)

    if (!scrollArea) return channels

    const height = await scrollArea.evaluate(
      (el) => el.getBoundingClientRect().height,
    )
    await page.mouse.wheel(0, height)
    await page.waitForTimeout(100)

    if (areSetsEqual(seen, prevSeen)) {
      break
    }

    prevSeen = new Set(seen)
    await page.waitForTimeout(300)
  }

  return channels
}
