import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useDetailResource<T extends { _id: string }>(
  resource: string,
  id: string | undefined
) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/${resource}/${id}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("No se pudo cargar el recurso");
        const json = await res.json();
        setItem(json.item as T);
      } catch (e: any) {
        if (e.name !== "AbortError")
          setError(e?.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [resource, id]);

  const remove = async () => {
    if (!item) return false;
    const res = await fetch(`/api/${resource}/${item._id}`, {
      method: "DELETE",
    });
    return res.ok;
  };

  const save = async (patch: Partial<T> & Record<string, any>) => {
    if (!item) return false;
    const res = await fetch(`/api/${resource}/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setItem({ ...item, ...patch });
      return true;
    }
    return false;
  };

  return { item, setItem, loading, error, isAdmin, remove, save };
}
