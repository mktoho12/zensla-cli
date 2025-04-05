# Slack Channel List

このプロジェクトは、Slack ワークスペース内のチャンネル一覧を取得するためのツールです。Playwright を使用してブラウザ操作を自動化し、チャンネル情報を収集します。

## 必要要件

- Node.js (22.x 以上)
- pnpm
- Slack ワークスペースへのアクセス

## インストール

1. リポジトリをクローンします。

   ```bash
   git clone https://github.com/mktoho12/slack-channel-list.git
   cd slack-channel-list
   ```

2. 必要な依存関係をインストールします。

   ```bash
   pnpm install
   ```

## 使用方法

### 認証を実行する

Slack にログインし、セッション情報を保存します。

```bash
slack-channel-list --auth
```

セッション情報の保存先を指定する場合:

```bash
slack-channel-list --auth --storageState custom/path/to/storageState.json
```

### チャンネルリストを取得する

ワークスペースの URL を指定してチャンネルリストを取得します。

```bash
slack-channel-list https://your-workspace.slack.com
```

セッション情報の保存先を指定する場合:

```bash
slack-channel-list https://your-workspace.slack.com --storageState custom/path/to/storageState.json
```

## 注意事項

- セッション情報には認証情報が含まれているため、慎重に取り扱ってください。

## ライセンス

このプロジェクトは [ISC ライセンス](LICENSE) の下でライセンスされています。
