"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Rect, Line, Transformer } from "react-konva";
import Konva from "konva";
import type { ScrapbookElement } from "@/hooks/useScrapbook";
import PolaroidImage from "./PolaroidImage";
import TextLabel from "./TextLabel";
import StickerElement from "./StickerElement";

interface Props {
  width: number;
  height: number;
  elements: ScrapbookElement[];
  selectedId: string | null;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, patch: Partial<ScrapbookElement>) => void;
  onDelete: () => void;
  readonly?: boolean;
}

const CANVAS_BG = "#faf6ee";

export default function ScrapbookCanvas({
  width,
  height,
  elements,
  selectedId,
  stageRef,
  onSelect,
  onUpdate,
  onDelete,
  readonly = false,
}: Props) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;

    if (selectedId) {
      const stage = stageRef.current;
      const node = stage?.findOne(`#${selectedId}`);
      if (node) {
        tr.nodes([node]);
        tr.getLayer()?.batchDraw();
        return;
      }
    }
    tr.nodes([]);
    tr.getLayer()?.batchDraw();
  }, [selectedId, elements, stageRef]);

  const handleStageClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (e.target === e.target.getStage()) {
        onSelect(null);
      }
    },
    [onSelect]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        onDelete();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDelete]);

  const renderElement = (el: ScrapbookElement) => {
    const common = {
      element: el,
      isSelected: !readonly && el.id === selectedId,
      onSelect: readonly ? () => {} : () => onSelect(el.id),
      onChange: readonly
        ? () => {}
        : (patch: Partial<ScrapbookElement>) => onUpdate(el.id, patch),
      readonly,
    };

    switch (el.type) {
      case "image":
        return <PolaroidImage key={el.id} {...common} />;
      case "text":
        return <TextLabel key={el.id} {...common} />;
      case "sticker":
        return <StickerElement key={el.id} {...common} />;
      default:
        return null;
    }
  };

  const mid = Math.round(width / 2);

  return (
    <Stage
      ref={(node) => {
        stageRef.current = node;
      }}
      width={width}
      height={height}
      onClick={handleStageClick}
      onTap={handleStageClick}
      style={{
        borderRadius: "8px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12), inset 0 0 60px rgba(0,0,0,0.03)",
      }}
    >
      <Layer listening={false}>
        <Rect x={0} y={0} width={mid} height={height} fill="#faf6ee" />
        <Rect x={mid} y={0} width={width - mid} height={height} fill="#f7f2e8" />

        {Array.from({ length: Math.floor(width / 30) }).map((_, col) =>
          Array.from({ length: Math.floor(height / 30) }).map((_, row) => {
            const dotX = col * 30 + 15;
            if (Math.abs(dotX - mid) < 12) return null;
            return (
              <Rect
                key={`dot-${col}-${row}`}
                x={dotX}
                y={row * 30 + 15}
                width={1.5}
                height={1.5}
                fill="rgba(180,160,130,0.18)"
              />
            );
          })
        )}

        <Rect
          x={mid - 14}
          y={0}
          width={14}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 14, y: 0 }}
          fillLinearGradientColorStops={[
            0, "rgba(0,0,0,0)",
            0.7, "rgba(0,0,0,0.04)",
            1, "rgba(0,0,0,0.1)",
          ]}
        />
        <Rect
          x={mid}
          y={0}
          width={14}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 14, y: 0 }}
          fillLinearGradientColorStops={[
            0, "rgba(0,0,0,0.1)",
            0.3, "rgba(0,0,0,0.04)",
            1, "rgba(0,0,0,0)",
          ]}
        />
        <Line
          points={[mid, 0, mid, height]}
          stroke="rgba(160,140,110,0.35)"
          strokeWidth={1.5}
        />
        <Line
          points={[mid + 1.5, 0, mid + 1.5, height]}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={0.75}
        />
      </Layer>

      <Layer>
        {elements.map(renderElement)}

        {!readonly && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
            borderStroke="#c78c8c"
            borderStrokeWidth={2}
            anchorStroke="#a86e3d"
            anchorFill="#fff"
            anchorSize={10}
            anchorCornerRadius={5}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 30 || newBox.height < 30) return oldBox;
              return newBox;
            }}
          />
        )}
      </Layer>
    </Stage>
  );
}
