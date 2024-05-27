# Magnito

フロントエンドは client ディレクトリの [Next.js](https://nextjs.org/) 、バックエンドは server ディレクトリの [frourio](https://frourio.com/) で構築された TypeScript で一気通貫開発が可能なモノレポサービス

最新のコミットによるデモ - https://solufa.github.io/next-frourio-starter/

## 開発手順

### Node.js のインストール

ローカルマシンに直接インストールする

https://nodejs.org/ja/ の左ボタン、LTS をダウンロードしてインストール

### npm モジュールのインストール

ルートとフロントとバックエンドそれぞれに package.json があるので 3 回インストールが必要

```sh
$ npm i
$ npm i --prefix client
$ npm i --prefix server
```

### 環境変数ファイルの作成

```sh
$ cp client/.env.example client/.env
$ cp server/.env.example server/.env
```

`client/.env` にCognito関連の値をセットする

### ミドルウェアのセットアップ

```sh
$ docker compose up -d
```

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
$ npm run notios
```

Web ブラウザで http://localhost:3000 を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

### SMTPサーバー

Docker の Inbucket が SMTP サーバーのスタブを提供している

http://localhost:9000/

serverからsendMailするとInbucketヘッダー中央の「Recent Mailboxes」に仮想メールが届く
