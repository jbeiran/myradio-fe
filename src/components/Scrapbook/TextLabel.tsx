"use client";

import React, { useRef, useState, useCallback, useEffect, forwardRef, useImperativeHandle } from "react";
import { Group, Text, Rect } from "react-konva";
import Konva from "konva";
import type { ScrapbookElement } from "@/hooks/useScrapbook";

interface Props {
  element: ScrapbookElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ScrapbookElement>) => void;
  readonly?: boolean;
  onStartEdit: (nodeId: string) => void;
  isEditing: boolean;
}

const PAD = 10;

export default function TextLabel({
  element,
  isSelected,
  onSelect,
  onChange,
  readonly = false,
  onStartEdit,
  isEditing,
}: Props) {
  const groupRef = useRef<Konva.Group>(null);
  const textRef = useRef<Konva.Text>(null);

  return (
    <Group
      ref={groupRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      draggable={!readonly && !isEditing}
      onClick={readonly ? undefined : onSelect}
      onTap={readonly ? undefined : onSelect}
      onDblClick={readonly ? undefined : () => onStartEdit(element.id)}
      onDblTap={readonly ? undefined : () => onStartEdit(element.id)}
      onDragEnd={
        readonly ? undefined : (e) => onChange({ x: e.target.x(), y: e.target.y() })
      }
      onTransformEnd={
        readonly
          ? undefined
          : () => {
              const node = groupRef.current;
              if (!node) return;
              onChange({
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                scaleX: node.scaleX(),
                scaleY: node.scaleY(),
              });
            }
      }
    >
      <Rect
        x={-PAD}
        y={-PAD / 2}
        width={(textRef.current?.width() ?? 120) + PAD * 2}
        height={(textRef.current?.height() ?? 30) + PAD}
        fill={isEditing ? "rgba(0,0,0,0)" : "rgba(255,255,240,0.85)"}
        shadowColor="rgba(0,0,0,0.08)"
        shadowBlur={isEditing ? 0 : 4}
        shadowOffsetY={2}
        cornerRadius={3}
      />
      <Text
        ref={textRef}
        text={isEditing ? "" : (element.text ?? "")}
        fontSize={element.fontSize ?? 28}
        fontFamily={element.fontFamily ?? "'Dancing Script', cursive"}
        fill={element.fill ?? "#5b6770"}
        padding={0}
      />
    </Group>
  );
}

interface TextEditorOverlayProps {
  element: ScrapbookElement;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  onCommit: (id: string, text: string) => void;
  onCancel: () => void;
}

export function TextEditorOverlay({
  element,
  stageRef,
  onCommit,
  onCancel,
}: TextEditorOverlayProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draft, setDraft] = useState(element.text ?? "");

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const group = stage.findOne(`#${element.id}`) as Konva.Group | undefined;
    const textNode = group?.findOne("Text") as Konva.Text | undefined;
    if (!textNode) {
      textarea.focus();
      return;
    }

    const stageBox = stage.container().getBoundingClientRect();
    const absPos = textNode.getAbsolutePosition();
    const absScale = textNode.getAbsoluteScale();
    const absRotation = textNode.getAbsoluteRotation();
    const fontSize = (element.fontSize ?? 28) * absScale.x;
    const approxWidth = Math.max((textNode.width() || 120) * absScale.x + PAD * 2, 180);

    textarea.style.top = `${stageBox.top + absPos.y - PAD / 2}px`;
    textarea.style.left = `${stageBox.left + absPos.x - PAD}px`;
    textarea.style.width = `${approxWidth}px`;
    textarea.style.fontSize = `${fontSize}px`;
    textarea.style.transform = `rotate(${absRotation}deg)`;
    textarea.style.transformOrigin = "top left";

    textarea.focus();
    textarea.select();

    const autoGrow = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    textarea.addEventListener("input", autoGrow);
    autoGrow();
    return () => textarea.removeEventListener("input", autoGrow);
  }, [element, stageRef]);

  const commit = useCallback(() => {
    onCommit(element.id, draft);
  }, [element.id, draft, onCommit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
    e.stopPropagation();
  };

  return (
    <textarea
      ref={textareaRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      onKeyUp={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        zIndex: 9999,
        fontFamily: element.fontFamily ?? "'Dancing Script', cursive",
        color: element.fill ?? "#5b6770",
        lineHeight: 1.2,
        padding: `${PAD / 2}px ${PAD}px`,
        border: "2px dashed #c78c8c",
        borderRadius: "4px",
        background: "rgba(255,255,240,0.97)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        outline: "none",
        resize: "none",
        overflow: "hidden",
        minWidth: "120px",
        backdropFilter: "blur(4px)",
        top: 0,
        left: 0,
        width: "180px",
        fontSize: "28px",
      }}
    />
  );
}
