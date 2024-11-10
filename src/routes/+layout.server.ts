import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// ログインが不要なパブリックルート
const PUBLIC_ROUTES = ['/login', '/'];

export const load: LayoutServerLoad = async ({ url, locals }) => {
  const isPublicRoute = PUBLIC_ROUTES.includes(url.pathname);

  if (!isPublicRoute && !locals.user) {
    throw redirect(302, '/login');
  }

  return {
    user: locals.user
  };
};
