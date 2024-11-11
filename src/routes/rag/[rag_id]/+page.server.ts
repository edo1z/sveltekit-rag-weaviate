import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

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

    // db.select() を使用して直接クエリを実行
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
