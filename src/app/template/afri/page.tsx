import { DesignPost } from "@/components/design-post";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ url: string; category: string; title: string }>;
}) {
  const data = await searchParams;
  const url = data.url;

  if (!url) {
    return null;
  }

  return (
    <main className="flex flex-col justify-center items-center bg-slate-500 h-dvh">
      <DesignPost data={data} autoInicial />
    </main>
  );
}
