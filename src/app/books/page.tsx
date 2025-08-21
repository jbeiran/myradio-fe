"use client";

import { MainTemplate } from "@/templates/MainTemplate";
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

export default function BooksListPage() {
  const { items, loading, error, page, totalPages, goTo } =
    usePaginatedList<BookItem>("books", { limit: 5 });

  return (
    <MainTemplate>
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
          Lista de libros leídos, con valoración ⭐
        </Text>

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
    </MainTemplate>
  );
}
