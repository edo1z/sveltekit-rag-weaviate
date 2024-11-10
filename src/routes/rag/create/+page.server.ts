import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const client = await weaviate.connectToWeaviateCloud(
    env.WEAVIATE_URL,
    {
      authCredentials: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
      headers: {
        'X-OpenAI-Api-Key': env.OPENAI_API_KEY,
      },
    }
  );

  const collections = await client.collections.listAll();
  client.close();

  return {
    collections
  };
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401);
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const promptForQuery = formData.get('promptForQuery')?.toString();
    const promptForResult = formData.get('promptForResult')?.toString();

    if (!name || !promptForQuery || !promptForResult) {
      return fail(400, { message: '必須項目が入力されていません' });
    }

    const id = generateRagId();
    const now = new Date();

    try {
      await db.insert(table.rag).values({
        id,
        userId: locals.user.id,
        name,
        description,
        promptForQuery,
        promptForResult,
        createdAt: now,
        updatedAt: now
      });

      return redirect(302, '/rag');
    } catch (error) {
      console.error('Error creating RAG:', error);
      return fail(500, { message: 'RAGの作成に失敗しました' });
    }
  },

  preview: async ({ request }) => {
    const formData = await request.formData();
    const collectionName = formData.get('collection')?.toString();
    const question = formData.get('question')?.toString();
    const promptForQuery = formData.get('promptForQuery')?.toString();
    const promptForResult = formData.get('promptForResult')?.toString();

    if (!collectionName || !question || !promptForQuery || !promptForResult) {
      return fail(400, { error: '必要な項目が不足しています' });
    }

    const client = await weaviate.connectToWeaviateCloud(
      env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': env.OPENAI_API_KEY,
        },
      }
    );

    try {
      // クエリの生成
      const queryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: promptForQuery },
            { role: 'user', content: question }
          ]
        })
      });

      const queryData = await queryResponse.json();
      const searchQuery = queryData.choices[0].message.content;

      console.log("検索クエリ", searchQuery);

      // ベクトル検索
      const collection = client.collections.get(collectionName);
      const searchResults = await collection.query.nearText(searchQuery, {
        limit: 5,
        returnMetadata: ['distance']
      });

      console.log("検索結果", searchResults);

      // 回答の生成
      const context = searchResults.objects.map(obj =>
        JSON.stringify(obj.properties)
      ).join('\n');

      console.log("コンテキスト", context);

      const answerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: promptForResult },
            { role: 'user', content: `質問: ${question}\n\nコンテキスト:\n${context}` }
          ]
        })
      });

      const answerData = await answerResponse.json();
      const answer = answerData.choices[0].message.content;

      console.log("回答", answer);

      return { answer };
    } catch (error) {
      console.error('Preview error:', error);
      return fail(500, { error: 'プレビューの実行中にエラーが発生しました' });
    } finally {
      client.close();
    }
  }
};

function generateRagId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
