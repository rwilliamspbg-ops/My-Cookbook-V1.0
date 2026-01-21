import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function AppLayout({ children }) {
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

