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
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import ModalForm from "@/components/ModalForm";
import { useDetailResource } from "@/hooks/useDetailResource";
import { formatDate } from "@/lib/date";
import { DiarySchema } from "@/pages-components/Admin/validationSchemas";

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

      <ModalForm
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title="Editar entrada"
        initialValues={{
          title: item?.title || "",
          content: item?.content || "",
          tags: item?.tags || "",
          date: item?.date
            ? new Date(item.date).toISOString().slice(0, 10)
            : "",
        }}
        fields={[
          { name: "title", label: "Título", type: "text" },
          { name: "content", label: "Contenido", type: "textarea", rows: 8 },
          { name: "tags", label: "Tags (coma)", type: "text" },
          { name: "date", label: "Fecha", type: "date" },
        ]}
        validationSchema={DiarySchema}
        onSubmit={async (values) => {
          if (!isAdmin || !item) return false;
          const ok = await save({
            title: values.title.trim(),
            content: values.content.trim(),
            tags: values.tags.trim(),
            date: values.date,
          });
          return ok;
        }}
      />
    </MainTemplate>
  );
}
