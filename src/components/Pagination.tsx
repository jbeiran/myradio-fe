import { Button, HStack } from "@chakra-ui/react";

type Props = {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
};

export function Pagination({ page, totalPages, onChange }: Props) {
  const tp = Math.max(1, totalPages || 1);

  let start = Math.max(1, page - 2);
  let end = Math.min(tp, start + 4);
  start = Math.max(1, end - 4);

  return (
    <HStack mt={8} justify="center" spacing={2} wrap="wrap">
      <Button
        variant="outline"
        onClick={() => onChange(page - 1)}
        isDisabled={page <= 1}
      >
        ← Anterior
      </Button>

      {Array.from({ length: Math.min(5, tp) }, (_, i) => {
        const p = start + i;
        return (
          <Button
            key={p}
            variant={p === page ? "solid" : "outline"}
            colorScheme={p === page ? "green" : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        );
      })}

      <Button
        variant="outline"
        onClick={() => onChange(page + 1)}
        isDisabled={page >= tp}
      >
        Siguiente →
      </Button>
    </HStack>
  );
}
