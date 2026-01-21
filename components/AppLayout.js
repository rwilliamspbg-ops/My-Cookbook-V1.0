import Head from "next/head";
import React from "react";
import AppLayout from "./AppLayout";

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>My Cookbook V1.0</title>
        <meta
          name="description"
          content="Combined recipe management app with OpenAI parsing from PDF/URL/text, full CRUD operations, and recipe editing capabilities."
        />
      </Head>

      <AppLayout>{children}</AppLayout>
    </>
  );
}

