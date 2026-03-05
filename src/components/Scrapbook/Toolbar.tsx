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
  HStack,
} from "@chakra-ui/react";
import {
  ImagePlus,
  Type,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
  Download,
  LogIn,
  Palette,
} from "lucide-react";
import NextLink from "next/link";
import type { ScrapbookElement } from "@/hooks/useScrapbook";

const TEXT_COLORS = [
  "#5b6770", // slate (default)
  "#2f5d3a", // evergreen
  "#a86e3d", // caramel
  "#c78c8c", // rose dust
  "#c29a3a", // mustard
  "#1a1a1a", // near black
  "#ffffff", // white
  "#7b5ea7", // purple
  "#2196f3", // blue
  "#e91e8c", // pink
];

interface Props {
  selectedId: string | null;
  selectedElement: ScrapbookElement | null;
  isLoggedIn: boolean;
  onAddImage: (file: File) => void;
  onAddText: () => void;
  onAddSticker: (emoji: string) => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onExport: () => void;
  onChangeTextColor: (color: string) => void;
}

const STICKERS = ["🌸", "✨", "💖", "🎀", "🦋", "🌷", "⭐", "🍓", "🌈", "💌", "🧸", "🎵"];

export default function Toolbar({
  selectedId,
  selectedElement,
  isLoggedIn,
  onAddImage,
  onAddText,
  onAddSticker,
  onDelete,
  onBringToFront,
  onSendToBack,
  onExport,
  onChangeTextColor,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isTextSelected = selectedElement?.type === "text";
  const currentColor = selectedElement?.fill ?? "#5b6770";

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

        {/* ── Color de texto — only shown when a text element is selected ── */}
        {isTextSelected && (
          <>
            <Divider borderColor="brand.creamSweater" />
            <HStack justify="space-between" align="center">
              <Text fontWeight="bold" fontSize="xs" color="brand.caramel" textTransform="uppercase" letterSpacing="wider">
                Color texto
              </Text>
              <Palette size={13} color="#a86e3d" />
            </HStack>
            <SimpleGrid columns={5} spacing={1}>
              {TEXT_COLORS.map((color) => (
                <Tooltip key={color} label={color} hasArrow>
                  <Box
                    as="button"
                    onClick={() => onChangeTextColor(color)}
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    bg={color}
                    border="3px solid"
                    borderColor={currentColor === color ? "brand.caramel" : "transparent"}
                    boxShadow={currentColor === color
                      ? "0 0 0 2px rgba(168,110,61,0.5)"
                      : "0 1px 3px rgba(0,0,0,0.2)"}
                    transition="all 0.15s"
                    _hover={{ transform: "scale(1.15)" }}
                  />
                </Tooltip>
              ))}
              {/* Native color picker for any custom color */}
              <Tooltip label="Color personalizado" hasArrow>
                <Box position="relative" w="28px" h="28px">
                  <Box
                    as="button"
                    w="28px"
                    h="28px"
                    borderRadius="full"
                    border="2px dashed"
                    borderColor="brand.slateGray"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="14px"
                    bg="white"
                    _hover={{ transform: "scale(1.15)" }}
                    transition="all 0.15s"
                  >
                    +
                  </Box>
                  <Box
                    as="input"
                    type="color"
                    position="absolute"
                    inset={0}
                    opacity={0}
                    w="full"
                    h="full"
                    cursor="pointer"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onChangeTextColor(e.target.value)
                    }
                  />
                </Box>
              </Tooltip>
            </SimpleGrid>
          </>
        )}

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
