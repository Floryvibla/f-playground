import { DesignPost } from "@/components/design-post";
import { DesignTemplateRequest } from "@/types/design-template";
import React from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<DesignTemplateRequest>;
}) {
  const data = await searchParams;
  const url = data.url;

  if (!url) {
    return null;
  }

  return <DesignPost data={data} autoInicial />;
}
