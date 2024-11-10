import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
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

  try {
    const collection = client.collections.get(params.name);
    const object = await collection.query.fetchObjectById(params.uuid);

    if (!object) {
      throw error(404, 'Object not found');
    }

    return {
      name: params.name,
      uuid: params.uuid,
      properties: object.properties
    };
  } finally {
    client.close();
  }
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const formData = await request.formData();
    const properties: Record<string, string> = {};

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
      await collection.data.update({
        id: params.uuid,
        properties: properties
      });
      return { success: true, name: params.name };
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, error: 'データの更新に失敗しました' };
    } finally {
      client.close();
    }
  }
};
