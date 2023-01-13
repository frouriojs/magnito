# |Project Name|

フロントエンドは src ディレクトリの [Next.js](https://nextjs.org/) 、バックエンドは server ディレクトリの [frourio](https://frourio.com/) で構築された TypeScript で一気通貫開発が可能なモノレポサービス

DB には PostgreSQL を使用

## インフラ構成

```mermaid
flowchart LR
  ELB[ELB]
  Node[Node.js]
  DB[(PostgreSQL)]
  Device([PC/Mobile])
  CF[CloudFront]
  CFE[CF Function]
  S3[(S3)]
  Git[(Git)]
  CI[Actions]

  CI --> |server/**| Node
  CI --> |migrate| DB
  CI --> |out/**| S3
  Device --> |API| ELB
  Device --> |Static| CF

  subgraph GitHub
    Git --> CI
  end

  subgraph AWS
    ELB --> |API| Node --> |SQL| DB
    CF --> CFE --> S3
  end
```

## デモ環境リンク

https://solufa.github.io/next-frourio-starter/

## ローカル開発

### PostgreSQL のセットアップ

ローカルマシンに直接インストールするか、Docker Compose を使う

https://github.com/solufa/docker-postgres

```sh
$ git clone https://github.com/solufa/docker-postgres.git
$ cd docker-postgres
$ docker-compose up -d
$ cd ..
```

### Node.js のインストール

ローカルマシンに直接インストールする

https://nodejs.org/ja/ の左ボタン、LTS をダウンロードしてインストール

### yarn のインストール

Node.js をインストールすると npm コマンドが使える

```sh
$ npm install -g yarn
```

### リポジトリのクローンと npm モジュールのインストール

フロントとバックエンドそれぞれに package.json があるので 2 回インストールが必要

```sh
$ git clone |Git URL|
$ cd |Project Directory|
$ yarn
$ yarn --cwd server
```

### 環境変数ファイルの作成

.env ファイルを 2 つ作成する  
prisma 用の.env には自分で起動した PostgreSQL の設定を書く  
上記の Docker Compose を使う場合は以下の設定

```sh
$ cp server/.env.example server/.env
$ echo "API_DATABASE_URL=postgresql://root:root@localhost:5432/|Project Name|" >> server/prisma/.env
```

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
$ yarn notios
```

Web ブラウザで http://localhost:3000 を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

### 開発中のバグの早期発見

開発サーバー起動後のターミナルで `dev > [run-p] dev:* > dev:typecheckClient (あるいはtypecheckServer)` の順に開いて Enter を押すと型検査の結果が表示される  
ファイルを保存するたびに更新されるのでブラウザで動かす前に型エラーを解消するとほとんどのバグがなくなる
