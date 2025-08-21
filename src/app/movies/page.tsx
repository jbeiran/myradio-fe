"use client";

import { MainTemplate } from "@/templates/MainTemplate";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { MovieCard, type MovieItem } from "@/components/MovieCard";
import { useRouter, useSearchParams } from "next/navigation";

type ListResponse = {
  page: number;
  limit: number;
  total: number;
  items: MovieItem[];
};

export default function MoviesListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Math.max(1, Number(searchParams?.get("page")) || 1);
  const [page, setPage] = useState<number>(initialPage);
  const [data, setData] = useState<ListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const limit = 5;

  const totalPages = useMemo(
    () => (data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1),
    [data]
  );

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/movies?page=${page}&limit=${limit}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al cargar películas");
        const json = (await res.json()) as ListResponse;
        setData(json);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    load();
    const sp = new URLSearchParams(Array.from(searchParams?.entries() || []));
    sp.set("page", String(page));
    router.replace(`/movies?${sp.toString()}`);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const goTo = (p: number) => {
    if (p < 1 || (data && p > totalPages)) return;
    setPage(p);
  };

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
          Películas
        </Heading>
        <Text textAlign="center" color="brand.slateGray" mb={6}>
          Lista de películas vistas, con valoración ⭐
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

        {!loading && !error && data && (
          <>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {data.items.map((it) => (
                <MovieCard key={it._id} item={it} />
              ))}
            </SimpleGrid>

            <HStack mt={8} justify="center" spacing={2} wrap="wrap">
              <Button
                variant="outline"
                onClick={() => goTo(page - 1)}
                isDisabled={page <= 1}
              >
                ← Anterior
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPages, start + 4);
                start = Math.max(1, end - 4);
                const p = start + i;
                return (
                  <Button
                    key={p}
                    variant={p === page ? "solid" : "outline"}
                    colorScheme={p === page ? "pink" : undefined}
                    onClick={() => goTo(p)}
                  >
                    {p}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                onClick={() => goTo(page + 1)}
                isDisabled={data && page >= totalPages}
              >
                Siguiente →
              </Button>
            </HStack>
          </>
        )}
      </Box>
    </MainTemplate>
  );
}
