"use client";

import { toPng } from "html-to-image";
import React, { useEffect, useRef, useState } from "react";

export function DesignPost({
  autoInicial,
  data,
}: {
  autoInicial?: boolean;
  data?: { url: string; category: string; title: string };
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [isExportImage, setIsExportImage] = useState(false);
  const [imageResult, setImageResult] = useState<boolean | string>(false);

  const sizeImage = { width: 1080, height: 1350 };

  const handleExportImage = async () => {
    if (ref.current) {
      setIsExportImage(true);
      const dataUrl = await toPng(ref.current, sizeImage);
      const link = document.createElement("a");
      link.download = "instagram-image.png";
      link.href = dataUrl;
      link.click();
      setIsExportImage(false);
    }
  };

  // useEffect(() => {
  //   if (autoInicial) {
  //     const handleGenerateImage = async () => {
  //       if (ref.current) {
  //         const dataUrl = await toPng(ref.current, sizeImage);

  //         const response = await fetch("/api/design", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ image: dataUrl }),
  //         });

  //         const result = await response.json();
  //         setImageResult(result.url);
  //         console.log("Image URL:", result.url);
  //       }
  //     };
  //     handleGenerateImage();
  //   }
  // }, [autoInicial]);

  // if (imageResult) {
  //   return imageResult;
  // }

  return (
    <div>
      <button
        onClick={handleExportImage}
        className="px-4 py-2 bg-blue-500 text-white rounded mx-auto mb-4"
      >
        Exportar como Imagem
      </button>
      <div
        ref={ref}
        id="design-content"
        className={`relative bg-red-400 ${
          autoInicial || isExportImage
            ? "w-[1080px] h-[1350px]"
            : "w-[328px] h-[460px]"
        }`}
      >
        <img
          src={`/api/proxy/designpost?url=${data?.url ?? "default"}`}
          alt=""
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-0 left-0 uppercase">
          <div
            className={` ${
              autoInicial || isExportImage
                ? "px-8 space-y-6 pb-64"
                : "px-4 space-y-1 pb-20"
            }  bg-gradient-to-t from-black via-black/80 to-transparent w-full`}
          >
            <div>
              <span
                className={`bg-green-700 rounded-full font-semibold ${
                  autoInicial || isExportImage
                    ? "text-5xl p-2 px-4"
                    : "text-sm p-1 px-2"
                }`}
              >
                {data?.category ?? "ESPORTES"}
              </span>
            </div>
            <div
              className={`font-black text-white ${
                autoInicial || isExportImage
                  ? "text-[3.4rem] leading-[3.3rem]"
                  : "leading-5"
              }`}
            >
              {data?.title ??
                "JOGADOR DESCOBRE QUE IRMÃO MORREU DURANTE PARTIDA DE FUTEBOL E RECEBE HOMENAGEM"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
