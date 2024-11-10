import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const client = await weaviate.connectToWeaviateCloud(
    env.WEAVIATE_URL,
    {
      authCredentials: new weaviate.ApiKey(env.WEAVIATE_API_KEY),
      headers: {
        'X-OpenAI-Api-Key': env.OPENAI_API_KEY,
      },
    }
  );

  const collection = client.collections.get(params.name);
  const items = [];

  for await (let item of collection.iterator({
    includeVector: true
  })) {
    items.push({
      uuid: item.uuid,
      properties: item.properties,
      vectors: item.vectors
    });
  }

  return {
    name: params.name,
    items
  };
};
