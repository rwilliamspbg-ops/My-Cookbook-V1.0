import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseUserFromRequest } from '@/lib/auth';
import AppLayout from '@/components/AppLayout';
import { ReactNode } from 'react';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default async function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // Await dynamic cookies API in Next 15
  const cookieStore = await cookies();

  // Pass the cookieStore directly into the shared auth helper
  const user = parseUserFromRequest(cookieStore);

  if (!user) {
    redirect('/login');
  }

  return <AppLayout>{children}</AppLayout>;
}
