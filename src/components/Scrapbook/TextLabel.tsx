"use client";

import React, { useRef } from "react";
import { Group, Text, Rect } from "react-konva";
import Konva from "konva";
import type { ScrapbookElement } from "@/hooks/useScrapbook";

interface Props {
  element: ScrapbookElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ScrapbookElement>) => void;
  readonly?: boolean;
}

const PAD = 10;

export default function TextLabel({
  element,
  isSelected,
  onSelect,
  onChange,
  readonly = false,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const textRef = useRef<Konva.Text>(null);

  const textWidth = textRef.current?.width() ?? 120;
  const textHeight = textRef.current?.height() ?? 30;

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
        x={-PAD}
        y={-PAD / 2}
        width={textWidth + PAD * 2}
        height={textHeight + PAD}
        fill="rgba(255,255,240,0.85)"
        shadowColor="rgba(0,0,0,0.08)"
        shadowBlur={4}
        shadowOffsetY={2}
        cornerRadius={3}
      />
      <Text
        ref={textRef}
        text={element.text}
        fontSize={element.fontSize ?? 28}
        fontFamily={element.fontFamily ?? "'Dancing Script', cursive"}
        fill={element.fill ?? "#5b6770"}
        padding={0}
      />
    </Group>
  );
}
