"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Konva from "konva";

export type ElementType = "image" | "text" | "sticker";

export interface ScrapbookElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  src?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export interface ScrapbookPage {
  _id: string;
  label: string;
  elements: ScrapbookElement[];
  position: number;
}

let nextId = Date.now();
const uid = (prefix = "el") => `${prefix}-${nextId++}`;

async function apiGet(): Promise<ScrapbookPage[]> {
  const res = await fetch("/api/scrapbook");
  if (!res.ok) throw new Error("Failed to load scrapbook");
  const data = await res.json();
  return data.pages ?? [];
}

async function apiCreatePage(label: string): Promise<ScrapbookPage> {
  const res = await fetch("/api/scrapbook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label }),
  });
  if (!res.ok) throw new Error("Failed to create page");
  return res.json();
}

async function apiUpdatePage(
  id: string,
  patch: { label?: string; elements?: ScrapbookElement[]; position?: number }
) {
  await fetch(`/api/scrapbook/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

async function apiDeletePage(id: string) {
  await fetch(`/api/scrapbook/${id}`, { method: "DELETE" });
}

async function apiUploadImage(
  file: File
): Promise<{ url: string; width: number; height: number }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/scrapbook/upload", {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}

export function useScrapbook() {
  const { data: session } = useSession();
  const isLoggedIn = !!(session?.user as any);

  const [pages, setPages] = useState<ScrapbookPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const loaded = await apiGet();
        if (!cancelled) setPages(loaded);
      } catch {
        if (!cancelled) setPages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentPage = pages[currentPageIndex] ?? pages[0];
  const elements = currentPage?.elements ?? [];

  const scheduleSave = useCallback(
    (updatedPages: ScrapbookPage[], pageIdx: number) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        const page = updatedPages[pageIdx];
        if (!page?._id) return;
        setSaving(true);
        try {
          await apiUpdatePage(page._id, {
            label: page.label,
            elements: page.elements,
          });
        } catch {
        } finally {
          setSaving(false);
        }
      }, 800);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const setElements = useCallback(
    (updater: (prev: ScrapbookElement[]) => ScrapbookElement[]) => {
      setPages((prev) => {
        const next = prev.map((p, i) =>
          i === currentPageIndex
            ? { ...p, elements: updater(p.elements) }
            : p
        );
        scheduleSave(next, currentPageIndex);
        return next;
      });
    },
    [currentPageIndex, scheduleSave]
  );

  const addElement = useCallback(
    (partial: Omit<ScrapbookElement, "id">) => {
      const el: ScrapbookElement = { ...partial, id: uid() };
      setElements((prev) => [...prev, el]);
      setSelectedId(el.id);
    },
    [setElements]
  );

  const updateElement = useCallback(
    (id: string, patch: Partial<ScrapbookElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...patch } : el))
      );
    },
    [setElements]
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, setElements]);

  const bringToFront = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === selectedId);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.push(item);
      return next;
    });
  }, [selectedId, setElements]);

  const sendToBack = useCallback(() => {
    if (!selectedId) return;
    setElements((prev) => {
      const idx = prev.findIndex((el) => el.id === selectedId);
      if (idx <= 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
  }, [selectedId, setElements]);

  const addImage = useCallback(
    async (file: File) => {
      setSaving(true);
      try {
        const { url, width, height } = await apiUploadImage(file);
        const maxDim = 280;
        const ratio = Math.min(maxDim / width, maxDim / height);
        addElement({
          type: "image",
          src: url,
          x: 100 + Math.random() * 200,
          y: 100 + Math.random() * 200,
          rotation: -5 + Math.random() * 10,
          scaleX: 1,
          scaleY: 1,
          width: width * ratio,
          height: height * ratio,
        });
      } finally {
        setSaving(false);
      }
    },
    [addElement]
  );

  const addText = useCallback(
    (text = "My note ✨", fontFamily = "'Dancing Script', cursive") => {
      addElement({
        type: "text",
        text,
        fontFamily,
        fontSize: 28,
        fill: "#5b6770",
        x: 150 + Math.random() * 150,
        y: 150 + Math.random() * 150,
        rotation: -3 + Math.random() * 6,
        scaleX: 1,
        scaleY: 1,
      });
    },
    [addElement]
  );

  const addSticker = useCallback(
    (emoji: string) => {
      addElement({
        type: "sticker",
        text: emoji,
        fontSize: 48,
        x: 200 + Math.random() * 200,
        y: 200 + Math.random() * 200,
        rotation: -10 + Math.random() * 20,
        scaleX: 1,
        scaleY: 1,
      });
    },
    [addElement]
  );

  const addPage = useCallback(async () => {
    setSaving(true);
    try {
      const newPage = await apiCreatePage(`Página ${pages.length + 1}`);
      setPages((prev) => [...prev, newPage]);
      setCurrentPageIndex(pages.length);
      setSelectedId(null);
    } finally {
      setSaving(false);
    }
  }, [pages.length]);

  const deletePage = useCallback(async () => {
    if (pages.length <= 1) return;
    const page = pages[currentPageIndex];
    if (!page?._id) return;

    setSaving(true);
    try {
      await apiDeletePage(page._id);
      setPages((prev) => prev.filter((_, i) => i !== currentPageIndex));
      setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      setSelectedId(null);
    } finally {
      setSaving(false);
    }
  }, [pages, currentPageIndex]);

  const goToPage = useCallback((index: number) => {
    setCurrentPageIndex(index);
    setSelectedId(null);
  }, []);

  const goNext = useCallback(() => {
    if (currentPageIndex < pages.length - 1) goToPage(currentPageIndex + 1);
  }, [currentPageIndex, pages.length, goToPage]);

  const goPrev = useCallback(() => {
    if (currentPageIndex > 0) goToPage(currentPageIndex - 1);
  }, [currentPageIndex, goToPage]);

  const renamePage = useCallback(
    (label: string) => {
      setPages((prev) => {
        const next = prev.map((p, i) =>
          i === currentPageIndex ? { ...p, label } : p
        );
        scheduleSave(next, currentPageIndex);
        return next;
      });
    },
    [currentPageIndex, scheduleSave]
  );

  const exportToPng = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const transformer = stage.findOne("Transformer") as Konva.Transformer;
    if (transformer) transformer.visible(false);
    stage.batchDraw();

    const uri = stage.toDataURL({ pixelRatio: 2 });

    if (transformer) transformer.visible(true);
    stage.batchDraw();

    const a = document.createElement("a");
    a.href = uri;
    a.download = `scrapbook-page-${currentPageIndex + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [currentPageIndex]);

  return {
    pages,
    currentPageIndex,
    currentPage,
    elements,
    selectedId,
    setSelectedId,
    stageRef,
    loading,
    saving,
    isLoggedIn,
    addImage,
    addText,
    addSticker,
    updateElement,
    deleteSelected,
    bringToFront,
    sendToBack,
    addPage,
    deletePage,
    goToPage,
    goNext,
    goPrev,
    renamePage,
    exportToPng,
  };
}
