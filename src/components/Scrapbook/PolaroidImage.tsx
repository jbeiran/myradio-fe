"use client";

import React, { useEffect, useRef, useState } from "react";
import { Group, Rect, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import type { ScrapbookElement } from "@/hooks/useScrapbook";

interface Props {
  element: ScrapbookElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ScrapbookElement>) => void;
  readonly?: boolean;
}

const BORDER = 12;
const BOTTOM_BORDER = 40;
const SHADOW_BLUR = 10;

export default function PolaroidImage({
  element,
  isSelected,
  onSelect,
  onChange,
  readonly = false,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!element.src) return;
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = element.src;
    image.onload = () => setImg(image);
  }, [element.src]);

  const w = element.width ?? 200;
  const h = element.height ?? 200;
  const frameW = w + BORDER * 2;
  const frameH = h + BORDER + BOTTOM_BORDER;

  if (!img) return null;

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable={!readonly}
      onClick={readonly ? undefined : onSelect}
      onTap={readonly ? undefined : onSelect}
      onDragEnd={readonly ? undefined : (e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={readonly ? undefined : () => {
        const node = groupRef.current;
        if (!node) return;
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          scaleX: node.scaleX(),
          scaleY: node.scaleY(),
        });
      }}
    >
      <Rect
        x={0}
        y={0}
        width={frameW}
        height={frameH}
        fill="#ffffff"
        shadowColor="rgba(0,0,0,0.25)"
        shadowBlur={SHADOW_BLUR}
        shadowOffsetY={4}
        cornerRadius={2}
      />
      <KonvaImage
        image={img}
        x={BORDER}
        y={BORDER}
        width={w}
        height={h}
      />
    </Group>
  );
}
