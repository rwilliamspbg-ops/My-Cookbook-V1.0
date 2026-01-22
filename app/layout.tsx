import '../styles/globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'My Cookbook',
  description: 'Your personal AI-powered cookbook',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
