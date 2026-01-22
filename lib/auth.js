import type { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export function parseUserFromRequest(cookiesOrReq: RequestCookies | { headers: { cookie?: string } }) {
  let cookieHeader: string | undefined;

  if ('getAll' in cookiesOrReq) {
    // Next.js cookies()
    cookieHeader = cookiesOrReq
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
  } else {
    cookieHeader = cookiesOrReq.headers.cookie;
  }

  // existing logic using cookieHeader...
}
