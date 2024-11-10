import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      rags: []
    };
  }

  const rags = await db
    .select()
    .from(table.rag)
    .where(eq(table.rag.userId, locals.user.id));

  return {
    rags
  };
};
