"use client";

import React, { useRef } from "react";
import {
  Box,
  VStack,
  IconButton,
  Tooltip,
  Divider,
  Text,
  SimpleGrid,
  Button,
} from "@chakra-ui/react";
import {
  ImagePlus,
  Type,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
  Download,
  LogIn,
} from "lucide-react";
import NextLink from "next/link";

interface Props {
  selectedId: string | null;
  isLoggedIn: boolean;
  onAddImage: (file: File) => void;
  onAddText: () => void;
  onAddSticker: (emoji: string) => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onExport: () => void;
}

const STICKERS = ["🌸", "✨", "💖", "🎀", "🦋", "🌷", "⭐", "🍓", "🌈", "💌", "🧸", "🎵"];

export default function Toolbar({
  selectedId,
  isLoggedIn,
  onAddImage,
  onAddText,
  onAddSticker,
  onDelete,
  onBringToFront,
  onSendToBack,
  onExport,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddImage(file);
    e.target.value = "";
  };

  // ── Guest view: invitation to log in ──
  if (!isLoggedIn) {
    return (
      <Box
        bg="rgba(255,255,255,0.82)"
        backdropFilter="blur(8px)"
        border="1px dashed"
        borderColor="brand.roseDust"
        borderRadius="xl"
        boxShadow="0 6px 20px rgba(47,93,58,0.08)"
        p={4}
        w="full"
        textAlign="center"
      >
        <VStack spacing={3}>
          <Text fontSize="2xl">🔒</Text>
          <Text fontSize="sm" color="brand.slateGray" fontStyle="italic">
            Inicia sesión para editar el scrapbook
          </Text>
          <Button
            as={NextLink}
            href="/login"
            size="sm"
            bg="brand.evergreen"
            color="white"
            _hover={{ bg: "brand.caramel" }}
            leftIcon={<LogIn size={14} />}
          >
            Iniciar sesión
          </Button>
          <Divider borderColor="brand.creamSweater" />
          <Text fontSize="xs" color="brand.slateGray" opacity={0.7}>
            Puedes ver y navegar las páginas sin cuenta
          </Text>
          {/* Export still available for guests */}
          <Tooltip label="Exportar como PNG" hasArrow>
            <IconButton
              aria-label="Exportar PNG"
              icon={<Download size={18} />}
              variant="solid"
              bg="brand.evergreen"
              color="white"
              _hover={{ bg: "brand.caramel" }}
              size="sm"
              w="full"
              onClick={onExport}
            />
          </Tooltip>
        </VStack>
      </Box>
    );
  }

  // ── Logged-in view: full toolbar ──
  return (
    <Box
      bg="rgba(255,255,255,0.82)"
      backdropFilter="blur(8px)"
      border="1px solid"
      borderColor="brand.evergreen"
      borderRadius="xl"
      boxShadow="0 6px 20px rgba(47,93,58,0.14)"
      p={4}
      w="full"
    >
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="xs" color="brand.caramel" textTransform="uppercase" letterSpacing="wider">
          Agregar
        </Text>

        <SimpleGrid columns={2} spacing={2}>
          <Tooltip label="Subir imagen" placement="right" hasArrow>
            <IconButton
              aria-label="Subir imagen"
              icon={<ImagePlus size={20} />}
              variant="outline"
              colorScheme="green"
              onClick={() => fileRef.current?.click()}
              size="md"
            />
          </Tooltip>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />

          <Tooltip label="Añadir texto" placement="right" hasArrow>
            <IconButton
              aria-label="Añadir texto"
              icon={<Type size={20} />}
              variant="outline"
              colorScheme="green"
              onClick={onAddText}
              size="md"
            />
          </Tooltip>
        </SimpleGrid>

        <Divider borderColor="brand.creamSweater" />

        <Text fontWeight="bold" fontSize="xs" color="brand.caramel" textTransform="uppercase" letterSpacing="wider">
          Stickers
        </Text>
        <SimpleGrid columns={4} spacing={1}>
          {STICKERS.map((s) => (
            <Button
              key={s}
              variant="ghost"
              size="sm"
              fontSize="xl"
              onClick={() => onAddSticker(s)}
              p={1}
              minW="auto"
            >
              {s}
            </Button>
          ))}
        </SimpleGrid>

        <Divider borderColor="brand.creamSweater" />

        <Text fontWeight="bold" fontSize="xs" color="brand.caramel" textTransform="uppercase" letterSpacing="wider">
          Capas
        </Text>
        <SimpleGrid columns={2} spacing={2}>
          <Tooltip label="Traer al frente" placement="right" hasArrow>
            <IconButton
              aria-label="Traer al frente"
              icon={<ArrowUpToLine size={18} />}
              variant="outline"
              colorScheme="orange"
              size="sm"
              onClick={onBringToFront}
              isDisabled={!selectedId}
            />
          </Tooltip>
          <Tooltip label="Enviar al fondo" placement="right" hasArrow>
            <IconButton
              aria-label="Enviar al fondo"
              icon={<ArrowDownToLine size={18} />}
              variant="outline"
              colorScheme="orange"
              size="sm"
              onClick={onSendToBack}
              isDisabled={!selectedId}
            />
          </Tooltip>
        </SimpleGrid>

        <Divider borderColor="brand.creamSweater" />

        <Text fontWeight="bold" fontSize="xs" color="brand.caramel" textTransform="uppercase" letterSpacing="wider">
          Acciones
        </Text>
        <VStack spacing={2}>
          <Tooltip label="Eliminar selección (Delete)" placement="right" hasArrow>
            <IconButton
              aria-label="Eliminar"
              icon={<Trash2 size={18} />}
              variant="outline"
              colorScheme="red"
              size="sm"
              w="full"
              onClick={onDelete}
              isDisabled={!selectedId}
            />
          </Tooltip>
          <Tooltip label="Exportar como PNG" placement="right" hasArrow>
            <IconButton
              aria-label="Exportar PNG"
              icon={<Download size={18} />}
              variant="solid"
              bg="brand.evergreen"
              color="white"
              _hover={{ bg: "brand.caramel" }}
              size="sm"
              w="full"
              onClick={onExport}
            />
          </Tooltip>
        </VStack>
      </VStack>
    </Box>
  );
}
