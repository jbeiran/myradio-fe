"use client";

import React, { useRef } from "react";
import { Group, Text } from "react-konva";
import Konva from "konva";
import type { ScrapbookElement } from "@/hooks/useScrapbook";

interface Props {
  element: ScrapbookElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ScrapbookElement>) => void;
  readonly?: boolean;
}

export default function StickerElement({
  element,
  isSelected,
  onSelect,
  onChange,
  readonly = false,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);

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
      <Text
        text={element.text}
        fontSize={element.fontSize ?? 48}
      />
    </Group>
  );
}
