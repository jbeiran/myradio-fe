"use client";

export const dynamic = "force-dynamic";

import { MainTemplate } from "@/templates/MainTemplate";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { MovieCard, type MovieItem } from "@/components/MovieCard";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Pagination } from "@/components/Pagination";
import FilterBar from "@/components/FilterBar";
import { Suspense } from "react";

export default function MoviesListPage() {
  const {
    items,
    loading,
    error,
    page,
    totalPages,
    goTo,
    filters,
    applyFilters,
  } = usePaginatedList<MovieItem>("movies", { limit: 5 });

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
        <Box layerStyle="panel">
          <Heading
            size="2xl"
            color="brand.evergreen"
            textAlign="center"
            mb={2}
            textShadow="1px 1px 3px rgba(168,110,61,0.3)"
          >
            Películas
          </Heading>
          <Text textAlign="center" color="brand.slateGray" mb={6}>
            Lista de películas vistas, con valoración
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
                name: "director",
                label: "Director",
                type: "text",
                placeholder: "Director",
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
              director: String(filters.director || ""),
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
                  <MovieCard key={it._id} item={it} />
                ))}
              </SimpleGrid>

              <Pagination page={page} totalPages={totalPages} onChange={goTo} />
            </>
          )}
        </Box>
      </Suspense>
    </MainTemplate>
  );
}
