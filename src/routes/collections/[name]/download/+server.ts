import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
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
    const items = [];

    for await (let item of collection.iterator()) {
      items.push(item.properties);
    }

    return new Response(JSON.stringify(items, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${params.name}_data.json"`
      }
    });
  } catch (error) {
    console.error('Error downloading data:', error);
    return new Response('データのダウンロードに失敗しました', { status: 500 });
  } finally {
    client.close();
  }
};
