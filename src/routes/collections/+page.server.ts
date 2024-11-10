import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

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

  const allCollections = await client.collections.listAll()

  return {
    collections: allCollections || []
  };
};
