"use client";

import React, { useMemo, useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Text,
  SimpleGrid,
  Box,
  Image,
  HStack,
  Button,
  useToast,
} from "@chakra-ui/react";

export default function PhotoUploader() {
  const toast = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [files]
  );
  const fieldBg = "white";

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  };

  const handleSubmit = async () => {
    if (!files.length) {
      toast({ title: "Selecciona al menos una foto", status: "warning" });
      return;
    }
    try {
      const data = new FormData();
      files.forEach((f) => data.append("files", f));
      const res = await fetch("/api/gallery", { method: "POST", body: data });
      if (!res.ok) throw new Error("No se pudo subir");
      toast({ title: "Fotos subidas", status: "success" });
      setFiles([]);
    } catch (e: any) {
      toast({ title: e?.message || "Error al subir", status: "error" });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <FormControl>
        <FormLabel>Seleccionar fotos</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelect}
          bg={fieldBg}
        />
      </FormControl>

      {previews.length > 0 && (
        <>
          <Divider />
          <Text fontWeight="bold" color="brand.evergreen">
            Previsualización
          </Text>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
            {previews.map((p) => (
              <Box
                key={p.url}
                borderWidth="1px"
                borderColor="brand.evergreen"
                borderRadius="md"
                overflow="hidden"
                bg="whiteAlpha.900"
              >
                <Image
                  src={p.url}
                  alt={p.name}
                  w="100%"
                  h="160px"
                  objectFit="cover"
                />
                <Box p={2}>
                  <Text fontSize="sm" noOfLines={1} title={p.name}>
                    {p.name}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </>
      )}

      <HStack>
        <Button colorScheme="green" onClick={handleSubmit}>
          Subir
        </Button>
        <Button
          variant="outline"
          borderColor="brand.evergreen"
          onClick={() => setFiles([])}
        >
          Limpiar
        </Button>
      </HStack>
    </VStack>
  );
}
