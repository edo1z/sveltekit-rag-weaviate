import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    return error(401, 'Unauthorized');
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
    const collections = await client.collections.listAll();

    const [rag] = await db
      .select()
      .from(table.rag)
      .where(eq(table.rag.id, params.rag_id))
      .limit(1);

    if (!rag) {
      return error(404, 'RAG not found');
    }

    return {
      rag,
      collections
    };
  } finally {
    client.close();
  }
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) {
      return fail(401);
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const promptForQuery = formData.get('promptForQuery')?.toString();
    const promptForResult = formData.get('promptForResult')?.toString();
    const collectionName = formData.get('collectionName')?.toString();
    const searchType = formData.get('searchType')?.toString();

    if (!name || !promptForQuery || !promptForResult || !collectionName || !searchType) {
      return fail(400, { message: '必須項目が入力されていません' });
    }

    if (searchType !== 'semantic' && searchType !== 'hybrid') {
      return fail(400, { message: '検索方法の値が不正です' });
    }

    const now = new Date();

    try {
      await db.update(table.rag)
        .set({
          name,
          description,
          promptForQuery,
          promptForResult,
          collectionName,
          searchType,
          updatedAt: now
        })
        .where(eq(table.rag.id, params.rag_id));

      return redirect(302, '/rag');
    } catch (error) {
      console.error('Error updating RAG:', error);
      return fail(500, { message: 'RAGの更新に失敗しました' });
    }
  },
};
