import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { CalendarIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useMemo, useState } from "react";

type FieldDef =
  | { name: string; label: string; type: "text"; placeholder?: string }
  | { name: string; label: string; type: "date"; placeholder?: string }
  | {
      name: string;
      label: string;
      type: "number";
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
    }
  | {
      name: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      placeholder?: string;
    };

type Props = {
  fields: FieldDef[];
  initialValues?: Record<string, string>;
  onSearch: (filters: Record<string, string>) => void;
  onClear: () => void;
};

export default function FilterBar({
  fields,
  initialValues,
  onSearch,
  onClear,
}: Props) {
  const init = useMemo(() => {
    const base: Record<string, string> = {};
    fields.forEach((f) => (base[f.name] = ""));
    return { ...base, ...(initialValues || {}) };
  }, [fields, initialValues]);

  const [form, setForm] = useState<Record<string, string>>(init);

  useEffect(() => {
    setForm(init);
  }, [init]);

  const handleChange = useCallback(
    (name: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.value;
        setForm((s) => ({ ...s, [name]: value }));
      },
    []
  );

  const handleSearch = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const next: Record<string, string> = {};
      Object.entries(form).forEach(([k, v]) => {
        const val = v?.trim();
        if (val) next[k] = val;
      });
      onSearch(next);
    },
    [form, onSearch]
  );

  const handleClear = useCallback(() => {
    setForm(init);
    onClear();
  }, [init, onClear]);

  const renderField = useCallback(
    (f: FieldDef) => {
      const commonLabelProps = {
        color: "brand.evergreen",
        fontWeight: "semibold" as const,
      };
      const commonInputProps = {
        value: form[f.name] || "",
        onChange: handleChange(f.name),
        size: "md" as const,
        bg: "white",
      };

      if (f.type === "text") {
        return (
          <FormControl key={f.name}>
            <FormLabel {...commonLabelProps}>{f.label}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="brand.caramel">
                <SearchIcon />
              </InputLeftElement>
              <Input
                {...commonInputProps}
                placeholder={f.placeholder || "Buscar..."}
                pl="10"
              />
            </InputGroup>
          </FormControl>
        );
      }

      if (f.type === "date") {
        return (
          <FormControl key={f.name}>
            <FormLabel {...commonLabelProps}>{f.label}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="brand.caramel">
                <CalendarIcon />
              </InputLeftElement>
              <Input
                {...commonInputProps}
                type="date"
                placeholder={(f as any).placeholder || "dd/mm/aaaa"}
                pl="10"
              />
            </InputGroup>
          </FormControl>
        );
      }

      if (f.type === "number") {
        return (
          <FormControl key={f.name}>
            <FormLabel {...commonLabelProps}>{f.label}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="brand.caramel">
                <StarIcon />
              </InputLeftElement>
              <Input
                {...commonInputProps}
                type="number"
                placeholder={f.placeholder}
                min={(f as any).min}
                max={(f as any).max}
                step={(f as any).step}
                pl="10"
              />
            </InputGroup>
          </FormControl>
        );
      }

      // select
      const sf = f as Extract<FieldDef, { type: "select" }>;
      return (
        <FormControl key={sf.name}>
          <FormLabel {...commonLabelProps}>{sf.label}</FormLabel>
          <Select
            {...commonInputProps}
            placeholder={sf.placeholder || "Selecciona"}
            iconColor="brand.caramel"
            bg="white"
          >
            {sf.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormControl>
      );
    },
    [form, handleChange]
  );

  return (
    <Box
      as="form"
      onSubmit={handleSearch}
      mb={6}
      p={{ base: 4, md: 5 }}
      border="2px dashed"
      borderColor="brand.caramel"
      borderRadius="md"
      bg="whiteAlpha.900"
      boxShadow="0 6px 14px rgba(47,93,58,0.15)"
    >
      <Stack spacing={3}>
        <SimpleGrid minChildWidth="220px" spacing={4} alignItems="end">
          {fields.map((f) => renderField(f))}
          <HStack alignSelf="end" spacing={3}>
            <Button
              type="submit"
              bg="brand.roseDust"
              color="white"
              _hover={{ bg: "brand.mustardVintage", color: "brand.evergreen" }}
              _active={{ bg: "brand.mustardVintage" }}
            >
              Buscar
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              variant="outline"
              borderColor="brand.evergreen"
              color="brand.evergreen"
              _hover={{ bg: "brand.creamSweater" }}
            >
              Limpiar
            </Button>
          </HStack>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
