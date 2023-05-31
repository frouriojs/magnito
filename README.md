# |Project Name|

フロントエンドは src ディレクトリの [Next.js](https://nextjs.org/) 、バックエンドは server ディレクトリの [frourio](https://frourio.com/) で構築された TypeScript で一気通貫開発が可能なモノレポサービス

## デモ環境リンク

https://solufa.github.io/next-frourio-starter/

## ローカル開発

### Node.js のインストール

ローカルマシンに直接インストールする

https://nodejs.org/ja/ の左ボタン、LTS をダウンロードしてインストール

### リポジトリのクローンと npm モジュールのインストール

フロントとバックエンドそれぞれに package.json があるので 2 回インストールが必要

```sh
$ npm i
$ npm i --prefix server
```

### 環境変数ファイルの作成

.env ファイルを 4 つ作成する  
prisma 用の.env には自分で起動した PostgreSQL の設定を書く

```sh
$ cp .env.example .env
$ cp server/.env.example server/.env
$ cp docker/dev/.env.example docker/dev/.env
$ echo "API_DATABASE_URL=postgresql://root:root@localhost:5432/|Project Name|" >> server/prisma/.env
```

### ミドルウェアのセットアップ

```sh
$ docker-compose up -d
```

#### Firebase Emulator

http://localhost:4000/auth

#### MinIO Console

http://localhost:9001/

#### PostgreSQL UI

```sh
$ cd server
$ npx prisma studio
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

### 開発中のバグの早期発見

開発サーバー起動後のターミナルで `dev > [run-p] dev:* > dev:typecheckClient (あるいはtypecheckServer)` の順に開いて Enter を押すと型検査の結果が表示される  
ファイルを保存するたびに更新されるのでブラウザで動かす前に型エラーを解消するとほとんどのバグがなくなる
