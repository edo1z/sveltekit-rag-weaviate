import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    return error(401, 'Unauthorized');
  }

  const rag = await db.query.rag.findFirst({
    where: eq(table.rag.id, params.rag_id)
  });

  if (!rag) {
    return error(404, 'RAG not found');
  }

  return {
    rag
  };
};
