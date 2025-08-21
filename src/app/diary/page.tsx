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
import { DiaryCard, type DiaryItem } from "@/components/DiaryCard";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Pagination } from "@/components/Pagination";

export default function DiaryListPage() {
  const { items, loading, error, page, totalPages, goTo } =
    usePaginatedList<DiaryItem>("diary", { limit: 5 });

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
          Diario
        </Heading>
        <Text textAlign="center" color="brand.slateGray" mb={6}>
          Notas, pensamientos y lecturas, con aroma otoñal 🍂📖
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
                <DiaryCard key={it._id} item={it} />
              ))}
            </SimpleGrid>

            <Pagination page={page} totalPages={totalPages} onChange={goTo} />
          </>
        )}
      </Box>
    </MainTemplate>
  );
}
