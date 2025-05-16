#!/usr/bin/env node

import { Command, Option } from '@commander-js/extra-typings'
import { existsSync } from 'fs'
import { saveStorageState } from './auth'
import { countMessages } from './countMessages'
import { fetchChannelList } from './fetchChannelList'

const program = new Command()
  .name('zensla')
  .description('Slackワークスペースを操作するためのCLIツール')
  .version('0.1.0')
  .addOption(
    new Option(
      '-s, --storageState <path>',
      'セッション情報の保存先または読み込み先のパス',
    ).default('sessions/storageState.json'),
  )
  .addOption(
    new Option('-o, --outDir <path>', '出力先フォルダのパス').default('out'),
  )

program
  .command('auth')
  .description('Slackにログインしてセッション情報を保存する')
  .action(async () => {
    const storageState = program.getOptionValue('storageState')
    await saveStorageState(storageState)
    console.log(`認証が完了しました: ${storageState}`)
  })

program
  .command('channels')
  .description('Slackワークスペースのチャンネル一覧を取得する')
  .argument(
    '<url>',
    'SlackワークスペースのURL（例: https://your-workspace.slack.com）',
  )
  .action(async (url: string) => {
    const storageState = program.getOptionValue('storageState')
    const outDir = program.getOptionValue('outDir')
    if (!existsSync(storageState)) {
      throw new Error(
        `エラー: セッション情報が保存されていません。auth コマンドを使用してログインしてください。 (${storageState})`,
      )
    }
    await fetchChannelList(url, storageState, outDir)
    console.log('Done!')
  })

program
  .command('message-counts')
  .description('各チャンネルのメッセージ数を取得する')
  .argument(
    '<url>',
    'SlackワークスペースのURL（例: https://your-workspace.slack.com）',
  )
  .option('--date <date>', 'メッセージのカウントを特定の日付に限定する')
  .action(async (url: string, options: { date?: string }) => {
    const storageState = program.getOptionValue('storageState')
    const outDir = program.getOptionValue('outDir')
    if (!existsSync(storageState)) {
      throw new Error(
        `エラー: セッション情報が保存されていません。auth コマンドを使用してログインしてください。 (${storageState})`,
      )
    }
    await countMessages(url, storageState, { ...options, outDir })
    console.log('Done!')
  })

program.parse()
