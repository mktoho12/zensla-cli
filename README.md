# zensla-cli

このプロジェクトは、Slack ワークスペースを操作するためのCLIツールです。Playwright を使用してブラウザ操作を自動化し、チャンネル情報の取得やメッセージ数のカウントなどの機能を提供します。

## 必要要件

- Node.js がインストールされていること
- npm または pnpm がインストールされていること
- Slack ワークスペースへのアクセス権

## インストール

1. npm または pnpm を使用してツールをインストールします。

   ```bash
   npm install -g zensla-cli
   ```

   または

   ```bash
   pnpm add -g zensla-cli
   ```

2. インストール後、`zensla` コマンドが使用可能になります。

## 使用方法

### 認証を実行する

Slack にログインし、セッション情報を保存します。

```bash
zensla auth
```

セッション情報の保存先を指定する場合:

```bash
zensla auth --storageState custom/path/to/storageState.json
```

### チャンネルリストを取得する

ワークスペースの URL を指定してチャンネルリストを取得します。

```bash
zensla channels https://your-workspace.slack.com
```

セッション情報の保存先を指定する場合:

```bash
zensla channels https://your-workspace.slack.com --storageState custom/path/to/storageState.json
```

### メッセージ数を取得する

ワークスペースの URL を指定してチャンネルごとのメッセージ数を取得します。

```bash
zensla message-counts https://your-workspace.slack.com
```

特定の日付のメッセージ数を取得する場合:

```bash
zensla message-counts https://your-workspace.slack.com --date 2024-03-20
```

## 注意事項

- セッション情報には認証情報が含まれているため、慎重に取り扱ってください。

---

## コントリビューター向け

### 必要要件

- Node.js (22.x 以上)
- pnpm
- Git

### 開発環境のセットアップ

1. リポジトリをクローンします。

   ```bash
   git clone https://github.com/mktoho12/zensla-cli.git
   cd zensla-cli
   ```

2. 必要な依存関係をインストールします。

   ```bash
   pnpm install
   ```

3. 開発モードでスクリプトを実行します。

   ```bash
   pnpm dev auth
   ```

### スクリプト

- `pnpm dev`: 開発モードでスクリプトを実行します。
- `pnpm build`: TypeScript をコンパイルします。
- `pnpm lint`: ESLint を使用してコードを検証します。
- `pnpm lint:fix`: ESLint の問題を自動修正します。
- `pnpm prettier`: Prettier を使用してコードを整形します。

### コントリビューションの方法

1. 新しいブランチを作成します。

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 変更を加え、コミットします。

   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. リモートリポジトリにプッシュします。

   ```bash
   git push origin feature/your-feature-name
   ```

4. プルリクエストを作成します。

### 注意事項

- コードスタイルを守るために、`pnpm lint` と `pnpm prettier` を実行してください。
- セッション情報や認証情報を含むファイルをコミットしないでください。

## ライセンス

このプロジェクトは [ISC ライセンス](LICENSE) の下でライセンスされています。
