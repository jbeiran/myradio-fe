"use client";

import { MainTemplate } from "@/templates/MainTemplate";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import IconRating from "@/components/IconRating";
import { formatDate } from "@/lib/date";
import { useDetailResource } from "@/hooks/useDetailResource";
import ModalForm from "@/components/ModalForm";
import { BookSchema } from "@/pages-components/Admin/validationSchemas";

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
                <Badge colorScheme="green" variant="solid">
                  {item.gender}
                </Badge>
              ) : null}
            </HStack>

            <Box mt={4} pointerEvents="none">
              <IconRating
                value={Math.max(0, Math.min(5, item.rating ?? 0))}
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

      <ModalForm
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title="Editar entrada"
        initialValues={{
          title: item?.title || "",
          author: item?.author || "",
          review: item?.review || "",
          gender: item?.gender || "",
          date: item?.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : "",
          rating: Math.max(0, Math.min(5, item?.rating ?? 0)),
        }}
        fields={[
          { name: "title", label: "Título", type: "text" },
          { name: "review", label: "Reseña", type: "textarea", rows: 8 },
          { name: "gender", label: "Género", type: "text" },
          { name: "date", label: "Fecha", type: "date" },
          { name: "author", label: "Autor", type: "text" },
          { name: "rating", label: "Rating", type: "rating", variant: "book" },
        ]}
        validationSchema={BookSchema}
        onSubmit={async (values) => {
          if (!isAdmin || !item) return false;
          const ok = await save({
            title: values.title.trim(),
            author: values.author.trim(),
            review: values.review.trim(),
            gender: values.gender.trim(),
            date: values.date,
            rating: values.rating,
          });
          return ok;
        }}
      />
    </MainTemplate>
  );
}
