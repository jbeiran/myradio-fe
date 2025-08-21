"use client";

import { MainTemplate } from "@/templates/MainTemplate";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
  const [item, setItem] = useState<DiaryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const editModal = useDisclosure();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");

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

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setContent(item.content);
      setTags(item.tags || "");
      setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
    }
  }, [item]);

  const handleDelete = async () => {
    if (!isAdmin || !item) return;
    if (!confirm("¿Eliminar esta entrada?")) return;
    const res = await fetch(`/api/diary/${item._id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/diary");
    } else {
      alert("No se pudo eliminar");
    }
  };

  const handleSave = async () => {
    if (!isAdmin || !item) return;
    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: tags.trim(),
      date,
    };
    const res = await fetch(`/api/diary/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setItem({
        ...item,
        title: payload.title,
        content: payload.content,
        tags: payload.tags,
        date: payload.date || null,
      });
      editModal.onClose();
    } else {
      alert("No se pudo guardar");
    }
  };

  const tagsArr =
    (item?.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [];

  return (
    <MainTemplate>
      <Box layerStyle="panel">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          mb={10}
        >
          <Button variant="outline" onClick={() => router.push("/diary")}>
            ← Volver al diario
          </Button>
          {isAdmin && (
            <HStack>
              <Button variant="outline" onClick={editModal.onOpen}>
                Editar
              </Button>
              <Button colorScheme="red" variant="solid" onClick={handleDelete}>
                Eliminar
              </Button>
            </HStack>
          )}
        </Stack>

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
              {tagsArr.map((t) => (
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

      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar entrada</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Título</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Contenido</FormLabel>
              <Textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </FormControl>
            <HStack>
              <FormControl>
                <FormLabel>Tags (coma)</FormLabel>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={editModal.onClose}>
              Cancelar
            </Button>
            <Button colorScheme="pink" onClick={handleSave}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MainTemplate>
  );
}
