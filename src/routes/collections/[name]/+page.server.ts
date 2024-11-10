import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { PageServerLoad, Actions } from './$types';

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
  let count = 0;
  const MAX_ITEMS = 50;

  for await (let item of collection.iterator()) {
    items.push({
      uuid: item.uuid,
      properties: item.properties,
      vectors: item.vectors
    });

    count++;
    if (count >= MAX_ITEMS) break;
  }

  return {
    name: params.name,
    items
  };
};

export const actions: Actions = {
  addItem: async ({ request, params }) => {
    const formData = await request.formData();
    const properties: Record<string, string> = {};

    // フォームデータからプロパティと値のペアを抽出
    for (let [key, value] of formData.entries()) {
      if (key.startsWith('property_')) {
        const index = key.split('_')[1];
        const valueKey = `value_${index}`;
        const propertyName = value.toString();
        const propertyValue = formData.get(valueKey)?.toString() || '';

        if (propertyName && propertyValue) {
          properties[propertyName] = propertyValue;
        }
      }
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
      const collection = client.collections.get(params.name);
      await collection.data.insert(properties);
      return { success: true };
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false, error: 'データの追加に失敗しました' };
    } finally {
      client.close();
    }
  }
};
