import { Command } from '@commander-js/extra-typings'
import { countMessages } from './countMessages'
import { main } from './main'

const program = new Command()

program
  .name('slack-channel-list')
  .description('Slackのチャンネルリストを取得する')
  .version('0.1.0')
  .argument(
    '<url>',
    'SlackワークスペースのURL（例: https://your-workspace.slack.com）',
  )
  .action(async (url) => {
    try {
      await main(url)
      await countMessages(url)
      console.log('Done!')
    } catch (error) {
      console.error('Error:', error)
      process.exit(1)
    }
  })

program.parse()
