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
import { useDetailResource } from "@/hooks/useDetailResource";
import { formatDate } from "@/lib/date";

type DiaryDetail = {
  _id: string;
  title: string;
  content: string;
  tags?: string;
  date?: string | null;
  createdAt?: string | null;
};

export default function DiaryDetailPage() {
  const { diaryId } = useParams<{ diaryId: string }>()!;
  const router = useRouter();

  const {
    item,
    loading,
    error,
    isAdmin,
    remove: removeItem,
    save,
  } = useDetailResource<DiaryDetail>("diary", diaryId);

  const editModal = useDisclosure();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState("");

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
    const ok = await removeItem();
    if (ok) {
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
    const ok = await save(payload);
    if (ok) {
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
