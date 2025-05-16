#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import { existsSync } from 'fs'
import { saveStorageState } from './auth'
import { countMessages } from './countMessages'
import { fetchChannelList } from './fetchChannelList'
const program = new Command()

program
  .name('slack-channel-list')
  .description('Slackのチャンネルリストを取得する')
  .version('0.1.0')
  .option('--auth', 'Slackにログインしてセッション情報を保存する')
  .option(
    '--storageState <path>',
    'セッション情報の保存先または読み込み先のパス',
    'sessions/storageState.json', // デフォルト値
  )
  .option('--date <date>', 'メッセージのカウントを特定の日付に限定する')
  .argument(
    '[url]',
    'SlackワークスペースのURL（例: https://your-workspace.slack.com）',
  )
  .action(
    (
      url: string | undefined,
      options: { auth?: boolean; storageState: string; date?: string },
    ) => {
      const main = async () => {
        if (options.auth) {
          // 認証処理を実行
          await saveStorageState(options.storageState)
          console.log(`認証が完了しました: ${options.storageState}`)
          return
        }

        if (!url) {
          throw new Error('エラー: URLを指定してください。')
        }

        // チャンネルリスト取得処理を実行
        const storageStatePath = options.storageState
        if (!existsSync(storageStatePath)) {
          throw new Error(
            `エラー: セッション情報が保存されていません。--authオプションを使用してログインしてください。 (${storageStatePath})`,
          )
        }
        // セッション情報を使用してブラウザを起動
        if (!options.date) {
          await fetchChannelList(url, storageStatePath)
        }
        await countMessages(url, storageStatePath, options)
        console.log('Done!')
      }

      main()
        .then(() => {
          process.exit(0)
        })
        .catch((error) => {
          console.error(error)
          process.exit(1)
        })
    },
  )

program.parse()
