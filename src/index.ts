import { main } from '@/main'
import { Command } from '@commander-js/extra-typings'

const program = new Command()

program
  .name('slack-channel-list')
  .description('Slackのチャンネルリストを取得する')
  .version('0.1.0')
  .argument(
    '<url>',
    'SlackワークスペースのURL（例: https://your-workspace.slack.com）',
  )
  .action((url) => {
    main(url)
      .then(() => {
        console.log('Done')
      })
      .catch((e) => {
        console.error(e)
      })
  })

program.parse()
