"use client";

export const dynamic = "force-dynamic";

import { MainTemplate } from "@/templates/MainTemplate";
import { Suspense } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { BookCard, type BookItem } from "@/components/BookCard";
import { Pagination } from "@/components/Pagination";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import FilterBar from "@/components/FilterBar";

function BooksList() {
  const {
    items,
    loading,
    error,
    page,
    totalPages,
    goTo,
    filters,
    applyFilters,
  } = usePaginatedList<BookItem>("books", { limit: 5 });

  return (
    <Box layerStyle="panel">
      <Heading
        size="2xl"
        color="brand.evergreen"
        textAlign="center"
        mb={2}
        textShadow="1px 1px 3px rgba(168,110,61,0.3)"
      >
        Libros
      </Heading>
      <Text textAlign="center" color="brand.slateGray" mb={6}>
        Lista de libros leídos, con valoración
      </Text>

      <FilterBar
        fields={[
          {
            name: "title",
            label: "Título",
            type: "text",
            placeholder: "Buscar por título",
          },
          {
            name: "author",
            label: "Autor",
            type: "text",
            placeholder: "Autor",
          },
          {
            name: "gender",
            label: "Género",
            type: "text",
            placeholder: "Género",
          },
          { name: "from", label: "Desde", type: "date" },
          { name: "to", label: "Hasta", type: "date" },
          {
            name: "minRating",
            label: "Rating mínimo",
            type: "select",
            options: [
              { value: "1", label: "1+" },
              { value: "2", label: "2+" },
              { value: "3", label: "3+" },
              { value: "4", label: "4+" },
              { value: "5", label: "5" },
            ],
            placeholder: "Cualquiera",
          },
        ]}
        initialValues={{
          title: String(filters.title || ""),
          author: String(filters.author || ""),
          gender: String(filters.gender || ""),
          from: String(filters.from || ""),
          to: String(filters.to || ""),
          minRating: String(filters.minRating || ""),
        }}
        onSearch={(next) => applyFilters(next)}
        onClear={() => applyFilters({})}
      />

      {loading && (
        <HStack justify="center" py={10}>
          <Spinner color="brand.caramel" />
          <Text>Cargando…</Text>
        </HStack>
      )}

      {!loading && error && (
        <Box textAlign="center" color="red.600" py={6}>
          {error}
        </Box>
      )}

      {!loading && !error && (
        <>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {items.map((it) => (
              <BookCard key={it._id} item={it} />
            ))}
          </SimpleGrid>

          <Pagination page={page} totalPages={totalPages} onChange={goTo} />
        </>
      )}
    </Box>
  );
}

export default function BooksListPage() {
  return (
    <MainTemplate>
      <Suspense
        fallback={
          <HStack justify="center" py={10}>
            <Spinner color="brand.caramel" />
            <Text>Cargando…</Text>
          </HStack>
        }
      >
        <BooksList />
      </Suspense>
    </MainTemplate>
  );
}
