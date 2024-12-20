import { DesignPost } from "@/components/design-post";
import React from "react";

export default function Page() {
  const data = {
    url: `https://homolog.plyn.com.br/africanize/wp-content/uploads/2024/12/cynthia-wicked.webp`,
    category: "ESPORTES",
    title:
      "JOGADOR DESCOBRE QUE IRMÃO MORREU DURANTE PARTIDA DE FUTEBOL E RECEBE HOMENAGEM",
  };

  return (
    <main className="flex flex-col justify-center items-center bg-slate-500 h-dvh">
      <DesignPost data={data} />
    </main>
  );
}
