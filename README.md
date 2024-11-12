# sveltekit-rag-weaviate

SvelteKit Weaviate RAG Labo

[![RAG System Demo](https://img.youtube.com/vi/2EOMFLimo0g/0.jpg)](https://www.youtube.com/watch?v=2EOMFLimo0g)

## 概要
- SvelteKitとWeaviateで作られたRAGの実験用システム
- OpenAI APIを使用
- DBはTursoのSQLiteを使用
- Weaviateにデータを追加・編集可能
- セマンティック検索の確認と類似度の表示
- 簡単なログイン機能を実装
- RAGの設定を複数登録可能
  - ベクトルDB検索用クエリ生成プロンプト
  - 回答文生成用プロンプト
  - 対象となるWeaviateコレクション
  - 検索方法（セマンティック・ハイブリッド）
- RAG設定の追加・編集画面でプレビュー実行可能

## セットアップ
### 環境変数の設定

```shell
cp .env.example .env
```

.envファイルに以下の環境変数を設定してください：

- Turso DB
  - DATABASE_URL
  - DATABASE_AUTH_TOKEN
- Weaviate
  - WEAVIATE_URL
  - WEAVIATE_API_KEY
- OpenAI
  - OPENAI_API_KEY

### インストールと実行

```shell
npm install
npm run dev
```
