# 0700-express-web-api

Express + TypeScript + Prisma + PostgreSQL によるWeb APIプロジェクト。Docker ベースの開発環境で動作します。

## 技術スタック

| カテゴリ          | 採用技術                |
| ----------------- | ----------------------- |
| ランタイム        | Node.js 20 (Alpine)     |
| 言語              | TypeScript 6            |
| Webフレームワーク | Express 5               |
| ORM               | Prisma 7                |
| データベース      | PostgreSQL 16           |
| コンテナ          | Docker / Docker Compose |
| 認証              | bcryptjs / jsonwebtoken |

## 前提条件

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) がインストール済みであること
- Git がインストール済みであること

> **ポート 5432 を占有するローカル PostgreSQL がある場合**、停止するか、`docker-compose.yml` のホスト側ポートを変更する（例: `"5433:5432"`）。

## セットアップ

### 1. リポジトリの取得

```bash
git clone <repository-url>
cd 0700-express-web-api
```

### 2. 環境変数ファイルの作成

`.env.example` および `.env.docker.example` をコピーして、それぞれ `.env`、`.env.docker` を作成します。

```bash
cp .env.example .env
cp .env.docker.example .env.docker
```

| ファイル      | 用途                                     | DB ホスト名                    |
| ------------- | ---------------------------------------- | ------------------------------ |
| `.env`        | ローカル（ホスト）から実行する場合の設定 | `localhost`                    |
| `.env.docker` | Docker コンテナ内で読み込む設定          | `db`（compose 内のサービス名） |

### 3. Docker コンテナの起動

```bash
docker compose up -d --build
```

### 4. 動作確認

```bash
# コンテナの状態確認
docker compose ps

# Express への疎通確認
curl http://localhost:3000/

# PostgreSQL への接続確認（ホストから）
psql -h 127.0.0.1 -p 5432 -U postgres -d express_web_api_db
```

## プロジェクト構成

```
.
├── prisma/
│   └── schema.prisma         # Prisma スキーマ定義
├── src/
│   └── index.ts              # Express エントリポイント
├── .dockerignore
├── .env.example              # ローカル用環境変数テンプレート
├── .env.docker.example       # Docker 用環境変数テンプレート
├── docker-compose.yml        # サービス定義 (app + db)
├── Dockerfile                # アプリコンテナのビルド定義
├── package.json
├── prisma.config.ts          # Prisma CLI 設定
├── README.md
└── tsconfig.json
```

## 接続情報（開発環境）

| 項目        | 値                    |
| ----------- | --------------------- |
| アプリ URL  | http://localhost:3000 |
| DB ホスト   | 127.0.0.1             |
| DB ポート   | 5432                  |
| DB ユーザー | postgres              |
| DB 名       | express_web_api_db    |
