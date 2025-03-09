import Image from "next/image";

export default function Editor() {
  return (
    <main className="flex bg-gray-600 items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]">
      <div
        id="editor"
        className="w-[300px] aspect-[9/16] relative shadow-2xl bg-black"
      >
        <Image
          src="https://lh3.googleusercontent.com/drive-storage/AJQWtBOBrwz-Kh-LPwr-NSHPYAACKvwq_7W6sjjSv4GxjTkcBIUS4tuOzw7v3fkBGISQMIxYS_YT-5C51J9_bwBvTTS5fDLkw_RMulTCGC0LrHWrifA=s1200"
          alt="imagem-edit"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute z-20 inset-0 bg-black/10" />
        <div className="absolute leading-8 flex-col top-[20%] flex items-center justify-center w-full px-4 text-center font-black z-20 text-4xl">
          <h1 className="drop-shadow-[0px_0px_10px_rgba(0,0,0,0.8)] lea">
            IA Lucrativa
          </h1>
          <span className="drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)] text-3xl">
            Crie e Venda InfoProdutos
          </span>
        </div>
      </div>
    </main>
  );
}

{
  /*
    <div className="relative w-full aspect-[9/16] relative shadow-2xl bg-black">
           <Image
            src="https://picsum.photos/id/${imageId}/800/1200"
            alt="imagem-edit"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlay / 100})` }}></div>
          <div
            className={cn(
              "absolute inset-x-0 px-8 transition-all",
              fontFamily,
              textAlign,
              fontWeight,
              textColor,
              textTransform,
              textShadow,
            )}
            style={{ top: `${textPosition}%`, transform: "translateY(-50%)" }}
          >
            <h1 className="mb-4 leading-tight tracking-tight" style={{ fontSize: `${fontSize}px` }}>
              {title}
            </h1>
            <p className="mb-8 opacity-90" style={{ fontSize: `${subtitleSize}px` }}>
              {subtitle}
            </p>
            <p className="opacity-80" style={{ fontSize: `${authorSize}px` }}>
              {author}
            </p>
          </div>
        </div>    
*/
}
