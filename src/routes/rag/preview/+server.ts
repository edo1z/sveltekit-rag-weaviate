import weaviate from 'weaviate-client';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const collectionName = formData.get('collection')?.toString();
  const question = formData.get('question')?.toString();
  const promptForQuery = formData.get('promptForQuery')?.toString();
  const promptForResult = formData.get('promptForResult')?.toString();
  const searchType = formData.get('searchType')?.toString();

  if (!collectionName || !question || !promptForQuery || !promptForResult || !searchType) {
    return json({ error: '必要な項目が不足しています' }, { status: 400 });
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

    const collection = client.collections.get(collectionName);
    let searchResults;

    if (searchType === 'hybrid') {
      // ハイブリッド検索の実装
      searchResults = await collection.query.hybrid(searchQuery, {
        limit: 5,
        alpha: 0.5, // セマンティック検索とキーワード検索の重み付け（0.0-1.0）
        returnMetadata: ['score','explainScore']
      });
    } else {
      // 従来のセマンティック検索
      searchResults = await collection.query.nearText(searchQuery, {
        limit: 5,
        returnMetadata: ['distance']
      });
    }

    const context = searchResults.objects.map(obj =>
      JSON.stringify(obj.properties)
    ).join('\n');

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
          { role: 'user', content: `質問: ${question}\n\n検索結果:\n${context}` }
        ]
      })
    });

    const answerData = await answerResponse.json();
    const answer = answerData.choices[0].message.content;

    return json({
      searchQuery,
      searchResults: searchResults.objects,
      answer
    });
  } catch (error) {
    console.error('Preview error:', error);
    return json({ error: 'プレビューの実行中にエラーが発生しました' }, { status: 500 });
  } finally {
    client.close();
  }
};