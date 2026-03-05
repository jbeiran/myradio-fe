"use client";

import React from "react";
import {
  HStack,
  VStack,
  Box,
  IconButton,
  Text,
  Tooltip,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import type { ScrapbookPage } from "@/hooks/useScrapbook";

interface Props {
  pages: ScrapbookPage[];
  currentPageIndex: number;
  isLoggedIn: boolean;
  onGoToPage: (index: number) => void;
  onGoNext: () => void;
  onGoPrev: () => void;
  onAddPage: () => void;
  onDeletePage: () => void;
  onRenamePage: (label: string) => void;
}

export default function PageNavigator({
  pages,
  currentPageIndex,
  isLoggedIn,
  onGoToPage,
  onGoNext,
  onGoPrev,
  onAddPage,
  onDeletePage,
  onRenamePage,
}: Props) {
  return (
    <VStack spacing={3} w="full">
      <Box
        bg="rgba(255,255,255,0.82)"
        backdropFilter="blur(8px)"
        border="1px solid"
        borderColor="brand.evergreen"
        borderRadius="xl"
        boxShadow="0 4px 14px rgba(47,93,58,0.1)"
        px={{ base: 2, md: 4 }}
        py={{ base: 2, md: 3 }}
        w="full"
        maxW="700px"
        mx="auto"
      >
        <HStack justify="center" align="center" spacing={{ base: 1, md: 3 }}>
          <Tooltip label="Página anterior" hasArrow>
            <IconButton
              aria-label="Página anterior"
              icon={<ChevronLeft size={18} />}
              variant="ghost"
              colorScheme="green"
              size="sm"
              onClick={onGoPrev}
              isDisabled={currentPageIndex === 0}
              minW={{ base: "32px", md: "40px" }}
            />
          </Tooltip>

          <HStack
            spacing={{ base: 1, md: 2 }}
            flex="1"
            justify="center"
            overflowX="auto"
            py={1}
            sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
          >
            {pages.map((page, i) => {
              const isActive = i === currentPageIndex;
              return (
                <Tooltip key={page._id} label={page.label} hasArrow>
                  <Box
                    as="button"
                    onClick={() => onGoToPage(i)}
                    w={{ base: "32px", md: "48px" }}
                    h={{ base: "24px", md: "36px" }}
                    borderRadius="md"
                    border="2px solid"
                    borderColor={isActive ? "brand.caramel" : "transparent"}
                    bg={isActive ? "brand.creamSweater" : "gray.100"}
                    boxShadow={isActive ? "0 0 0 2px rgba(168,110,61,0.3)" : "none"}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "brand.roseDust",
                      transform: "scale(1.1)",
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                    flexShrink={0}
                  >
                    <Text
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight={isActive ? "bold" : "normal"}
                      color={isActive ? "brand.caramel" : "brand.slateGray"}
                    >
                      {i + 1}
                    </Text>
                    {page.elements.length > 0 && (
                      <Box
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        w={{ base: "6px", md: "8px" }}
                        h={{ base: "6px", md: "8px" }}
                        borderRadius="full"
                        bg="brand.roseDust"
                      />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </HStack>

          <Tooltip label="Página siguiente" hasArrow>
            <IconButton
              aria-label="Página siguiente"
              icon={<ChevronRight size={18} />}
              variant="ghost"
              colorScheme="green"
              size="sm"
              onClick={onGoNext}
              isDisabled={currentPageIndex === pages.length - 1}
              minW={{ base: "32px", md: "40px" }}
            />
          </Tooltip>
        </HStack>

        {isLoggedIn && <HStack justify="center" spacing={2} mt={2}>
          <Tooltip label="Nueva página" hasArrow>
            <IconButton
              aria-label="Nueva página"
              icon={<Plus size={16} />}
              variant="solid"
              bg="brand.evergreen"
              color="white"
              _hover={{ bg: "brand.caramel" }}
              size="xs"
              onClick={onAddPage}
            />
          </Tooltip>

          <Tooltip label="Eliminar esta página" hasArrow>
            <IconButton
              aria-label="Eliminar página"
              icon={<Trash2 size={14} />}
              variant="ghost"
              colorScheme="red"
              size="xs"
              onClick={onDeletePage}
              isDisabled={pages.length <= 1}
            />
          </Tooltip>
        </HStack>}
      </Box>

      {isLoggedIn ? (
        <Editable
          value={pages[currentPageIndex]?.label ?? ""}
          onChange={onRenamePage}
          textAlign="center"
          fontSize="sm"
          color="brand.slateGray"
          fontStyle="italic"
        >
          <Tooltip label="Click para renombrar" hasArrow>
            <EditablePreview
              px={2}
              _hover={{ bg: "brand.creamSweater", cursor: "text" }}
            />
          </Tooltip>
          <EditableInput
            px={2}
            _focus={{
              borderColor: "brand.evergreen",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-evergreen)",
            }}
          />
        </Editable>
      ) : (
        <Text
          textAlign="center"
          fontSize="sm"
          color="brand.slateGray"
          fontStyle="italic"
          px={2}
        >
          {pages[currentPageIndex]?.label ?? ""}
        </Text>
      )}
    </VStack>
  );
}
