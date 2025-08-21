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
  useDisclosure,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalFooter,
} from "@chakra-ui/react";
import IconRating from "@/pages-components/Admin/IconRating";
import { formatDate } from "@/lib/date";
import { useDetailResource } from "@/hooks/useDetailResource";

type BookDetail = {
  _id: string;
  title: string;
  author: string;
  rating: number;
  review: string;
  date?: string | null;
  gender?: string;
  createdAt?: string | null;
};

export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>()!;
  const router = useRouter();

  const {
    item,
    loading,
    error,
    isAdmin,
    remove: removeItem,
    save,
  } = useDetailResource<BookDetail>("books", bookId);

  const editModal = useDisclosure();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [review, setReview] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setAuthor(item.author || "");
      setReview(item.review);
      setGender(item.gender || "");
      setDate(item.date ? new Date(item.date).toISOString().slice(0, 10) : "");
      setRating(item.rating || 1);
    }
  }, [item]);

  const handleDelete = async () => {
    if (!isAdmin || !item) return;
    if (!confirm("¿Eliminar esta entrada?")) return;
    const ok = await removeItem();
    if (ok) {
      router.push("/books");
    } else {
      alert("No se pudo eliminar");
    }
  };

  const handleSave = async () => {
    if (!isAdmin || !item) return;
    const payload = {
      title: title.trim(),
      author: author.trim(),
      review: review.trim(),
      gender: gender.trim(),
      date,
      rating,
    };
    const ok = await save(payload);
    if (ok) {
      editModal.onClose();
    } else {
      alert("No se pudo guardar");
    }
  };

  return (
    <MainTemplate>
      <Box layerStyle="panel">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          mb={10}
        >
          <Button variant="outline" onClick={() => router.push("/books")}>
            ← Volver a libros
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
              mb={2}
              size="2xl"
              color="brand.evergreen"
              textShadow="1px 1px 3px rgba(168,110,61,0.3)"
            >
              {item.title}
            </Heading>

            <Text mt={1} color="brand.slateGray" fontStyle="italic">
              Autor: {item.author}
            </Text>

            <HStack mt={2} spacing={3}>
              <Text fontSize="sm" color="brand.slateGray">
                {formatDate(item.date || item.createdAt)}
              </Text>
              {item.gender ? (
                <Badge colorScheme="pink" variant="solid">
                  {item.gender}
                </Badge>
              ) : null}
            </HStack>

            <Box mt={4} pointerEvents="none">
              <IconRating
                value={Math.max(1, Math.min(5, item.rating || 1))}
                onChange={() => {}}
                variant="book"
              />
            </Box>

            <Text
              mt={6}
              whiteSpace="pre-wrap"
              lineHeight="tall"
              color="brand.slateGray"
            >
              {item.review}
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
              <FormLabel>Reseña</FormLabel>
              <Textarea
                rows={8}
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </FormControl>
            <HStack>
              <FormControl>
                <FormLabel>Género</FormLabel>
                <Input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
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
            <FormControl mb={3}>
              <FormLabel>Autor</FormLabel>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Rating</FormLabel>
              <IconRating value={rating} onChange={setRating} variant="book" />
            </FormControl>
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
