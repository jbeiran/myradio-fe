"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type PaginatedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  items: T[];
};

export function usePaginatedList<T>(
  resource: string,
  { limit = 5 }: { limit?: number } = {}
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = Math.max(1, Number(searchParams?.get("page")) || 1);
  const [page, setPage] = useState<number>(initialPage);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const res = await fetch(
          `/api/${resource}?page=${page}&limit=${limit}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error("Error al cargar la lista");
        const json = (await res.json()) as PaginatedResponse<T>;
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
    router.replace(`/${resource}?${sp.toString()}`);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resource, limit]);

  const goTo = (p: number) => {
    if (p < 1 || (data && p > totalPages)) return;
    setPage(p);
  };

  return {
    page,
    goTo,
    data,
    items: data?.items || [],
    totalPages,
    loading,
    error,
  };
}
