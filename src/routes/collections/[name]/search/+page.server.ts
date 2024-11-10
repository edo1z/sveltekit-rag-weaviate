import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  return {
    name: params.name,
    searchResults: []
  };
};

export const actions: Actions = {
  search: async ({ request, params }) => {
    const formData = await request.formData();
    const query = formData.get('query')?.toString() || '';

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
      const collection = client.collections.get(params.name);
      const result = await collection.query.nearText(query, {
        limit: 10,
        returnMetadata: ['distance']
      });

      return {
        success: true,
        results: result.objects.map(item => ({
          uuid: item.uuid,
          properties: item.properties,
          score: item.metadata?.distance ? 1 - item.metadata.distance : 0
        }))
      };
    } catch (error) {
      console.error('Search error:', error);
      return { success: false, error: '検索に失敗しました' };
    } finally {
      client.close();
    }
  }
};
