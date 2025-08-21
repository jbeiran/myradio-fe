"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type PaginatedResponse<T> = {
  page: number;
  limit: number;
  total: number;
  items: T[];
};

type Filters = Record<string, string | number | undefined | null>;

export function usePaginatedList<T>(
  resource: string,
  {
    limit = 4,
    initialFilters = {} as Filters,
  }: { limit?: number; initialFilters?: Filters } = {}
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Math.max(1, Number(searchParams?.get("page")) || 1);

  const urlFilters = useMemo<Filters>(() => {
    const sp = new URLSearchParams(Array.from(searchParams?.entries() || []));
    const obj: Filters = {};
    sp.forEach((v, k) => {
      if (k !== "page" && k !== "limit" && v !== "") obj[k] = v;
    });
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [page, setPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<Filters>({
    ...initialFilters,
    ...urlFilters,
  });
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
        const sp = new URLSearchParams();
        sp.set("page", String(page));
        sp.set("limit", String(limit));
        Object.entries(filters).forEach(([k, v]) => {
          const val = v === null || v === undefined ? "" : String(v);
          if (val.trim() !== "") sp.set(k, val);
        });

        const url = `/api/${resource}?${sp.toString()}`;

        const res = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al cargar la lista");
        const json = (await res.json()) as PaginatedResponse<T>;
        setData(json);

        router.replace(`/${resource}?${sp.toString()}`);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resource, limit, filters]);

  const goTo = (p: number) => {
    if (p < 1 || (data && p > totalPages)) return;
    setPage(p);
  };

  const applyFilters = (next: Filters) => {
    setPage(1);
    setFilters(next);
  };

  return {
    page,
    goTo,
    data,
    items: data?.items || [],
    totalPages,
    loading,
    error,
    filters,
    applyFilters,
  };
}
