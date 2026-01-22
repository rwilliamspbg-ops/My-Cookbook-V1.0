import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import AppLayout from '@/components/AppLayout';
import { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

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

