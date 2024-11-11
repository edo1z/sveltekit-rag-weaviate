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
};

function generateRagId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}
