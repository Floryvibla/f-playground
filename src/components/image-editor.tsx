"use client";

import { useState, useRef } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import * as htmlToImage from "html-to-image";

interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  shadow: string;
}

const DraggableText = ({
  element,
  onUpdate,
}: {
  element: TextElement;
  onUpdate: (id: string, updates: Partial<TextElement>) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        position: "absolute",
        left: element.x,
        top: element.y,
        fontSize: `${element.fontSize}px`,
        fontFamily: element.fontFamily,
        color: element.color,
        textShadow: element.shadow,
        cursor: "move",
      }}
      {...listeners}
      {...attributes}
    >
      {element.content}
    </div>
  );
};

export default function ImageEditor() {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBackgroundImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addText = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      content: "Novo Texto",
      x: 50,
      y: 50,
      fontSize: 20,
      fontFamily: "Arial",
      color: "#000000",
      shadow: "none",
    };
    setTextElements([...textElements, newElement]);
  };

  const updateElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const exportImage = async () => {
    if (editorRef.current) {
      const dataUrl = await htmlToImage.toPng(editorRef.current);
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        <button
          onClick={addText}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Texto
        </button>
        <button
          onClick={exportImage}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Exportar
        </button>
      </div>

      <DndContext>
        <div
          ref={editorRef}
          className="relative w-[800px] h-[600px] border border-gray-300"
          style={{
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : "none",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {textElements.map((element) => (
            <DraggableText
              key={element.id}
              element={element}
              onUpdate={updateElement}
            />
          ))}
        </div>
      </DndContext>

      <div className="mt-4 space-y-4">
        {textElements.map((element) => (
          <div key={element.id} className="flex space-x-4">
            <input
              type="text"
              value={element.content}
              onChange={(e) =>
                updateElement(element.id, { content: e.target.value })
              }
              className="border p-2"
            />
            <input
              type="number"
              value={element.fontSize}
              onChange={(e) =>
                updateElement(element.id, { fontSize: Number(e.target.value) })
              }
              className="border p-2 w-20"
            />
            <select
              value={element.fontFamily}
              onChange={(e) =>
                updateElement(element.id, { fontFamily: e.target.value })
              }
              className="border p-2"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
            <input
              type="color"
              value={element.color}
              onChange={(e) =>
                updateElement(element.id, { color: e.target.value })
              }
              className="border p-2"
            />
            <select
              value={element.shadow}
              onChange={(e) =>
                updateElement(element.id, { shadow: e.target.value })
              }
              className="border p-2"
            >
              <option value="none">Sem sombra</option>
              <option value="2px 2px 4px rgba(0,0,0,0.5)">Sombra suave</option>
              <option value="4px 4px 8px rgba(0,0,0,0.5)">Sombra média</option>
              <option value="6px 6px 12px rgba(0,0,0,0.5)">Sombra forte</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
