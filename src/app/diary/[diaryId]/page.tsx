"use client";

import { MainTemplate } from "@/templates/MainTemplate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Heading, Text, HStack, Badge, Button } from "@chakra-ui/react";

type DiaryDetail = {
  _id: string;
  title: string;
  content: string;
  tags?: string;
  date?: string | null;
  createdAt?: string | null;
};

function formatDate(input?: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

export default function DiaryDetailPage() {
  const { diaryId } = useParams<{ diaryId: string }>()!;
  const router = useRouter();
  const [item, setItem] = useState<DiaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/diary/${diaryId}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("No se pudo cargar la entrada");
        const json = await res.json();
        setItem(json.item);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [diaryId]);

  const tags =
    (item?.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [];

  return (
    <MainTemplate>
      <Box layerStyle="panel">
        <Button variant="outline" mb={10} onClick={() => router.push("/diary")}>
          ← Volver al diario
        </Button>

        {loading && <Text>Cargando…</Text>}
        {!loading && error && <Text color="red.600">{error}</Text>}

        {!loading && !error && item && (
          <>
            <Heading
              mb={5}
              size="2xl"
              color="brand.evergreen"
              textShadow="1px 1px 3px rgba(168,110,61,0.3)"
            >
              {item.title}
            </Heading>
            <Text mt={2} color="brand.slateGray" fontSize="sm">
              {formatDate(item.date || item.createdAt)}
            </Text>

            <HStack mt={3} spacing={2} flexWrap="wrap">
              {tags.map((t) => (
                <Badge key={t} colorScheme="pink" variant="solid">
                  #{t}
                </Badge>
              ))}
            </HStack>

            <Text
              mt={6}
              whiteSpace="pre-wrap"
              lineHeight="tall"
              color="brand.slateGray"
            >
              {item.content}
            </Text>
          </>
        )}
      </Box>
    </MainTemplate>
  );
}
