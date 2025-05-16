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
# または短縮形を使用
zensla auth -s custom/path/to/storageState.json
```

### チャンネルリストを取得する

ワークスペースの URL を指定してチャンネルリストを取得します。

```bash
zensla channels https://your-workspace.slack.com
```

セッション情報の保存先を指定する場合:

```bash
zensla channels https://your-workspace.slack.com --storageState custom/path/to/storageState.json
# または短縮形を使用
zensla channels https://your-workspace.slack.com -s custom/path/to/storageState.json
```

出力先フォルダを指定する場合:

```bash
zensla channels https://your-workspace.slack.com --outDir custom/path/to/output
# または短縮形を使用
zensla channels https://your-workspace.slack.com -o custom/path/to/output
```

両方のオプションを組み合わせることもできます:

```bash
zensla channels https://your-workspace.slack.com -s custom/path/to/storageState.json -o custom/path/to/output
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

出力先フォルダを指定する場合:

```bash
zensla message-counts https://your-workspace.slack.com --outDir custom/path/to/output
# または短縮形を使用
zensla message-counts https://your-workspace.slack.com -o custom/path/to/output
```

特定の日付のメッセージ数を取得し、出力先フォルダも指定する場合:

```bash
zensla message-counts https://your-workspace.slack.com --date 2024-03-20 --outDir custom/path/to/output
# または短縮形を使用
zensla message-counts https://your-workspace.slack.com --date 2024-03-20 -o custom/path/to/output
```

注: 日付を指定した場合、出力ファイルは `<outDir>/history/<date>.json` に保存されます。

## 注意事項

- セッション情報には認証情報が含まれているため、慎重に取り扱ってください。
- 出力先フォルダを指定しない場合、デフォルトで `out` ディレクトリに出力されます。
- 出力先フォルダは `--outDir` または `-o` で指定できます。
- セッション情報の保存先は `--storageState` または `-s` で指定できます。

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
