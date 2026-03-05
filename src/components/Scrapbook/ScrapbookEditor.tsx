"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Center,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { Cloud, CloudOff } from "lucide-react";
import { useScrapbook } from "@/hooks/useScrapbook";
import ScrapbookCanvas from "./ScrapbookCanvas";
import Toolbar from "./Toolbar";
import PageNavigator from "./PageNavigator";

const ASPECT_RATIO = 900 / 620;
const MIN_W = 320;
const MAX_W = 960;

export default function ScrapbookEditor() {
  const {
    pages,
    currentPageIndex,
    elements,
    selectedId,
    setSelectedId,
    stageRef,
    loading,
    saving,
    isLoggedIn,
    addImage,
    addText,
    addSticker,
    updateElement,
    deleteSelected,
    bringToFront,
    sendToBack,
    addPage,
    deletePage,
    goToPage,
    goNext,
    goPrev,
    renamePage,
    exportToPng,
  } = useScrapbook();

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null;

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [stageDims, setStageDims] = useState({
    w: MAX_W,
    h: Math.round(MAX_W / ASPECT_RATIO),
  });

  const measure = useCallback(() => {
    const container = canvasContainerRef.current;
    if (!container) return;
    const available = Math.min(Math.max(container.clientWidth, MIN_W), MAX_W);
    setStageDims({
      w: Math.round(available),
      h: Math.round(available / ASPECT_RATIO),
    });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (canvasContainerRef.current) ro.observe(canvasContainerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  if (loading) {
    return (
      <Center py={20} flexDirection="column" gap={3}>
        <Spinner size="xl" color="brand.evergreen" thickness="3px" />
        <Text color="brand.slateGray" fontSize="sm">
          Cargando tu scrapbook...
        </Text>
      </Center>
    );
  }

  return (
    <Box py={{ base: 3, md: 6 }}>
      <Box textAlign="center" mb={{ base: 3, md: 4 }}>
        <Heading
          fontSize={{ base: "2xl", md: "3xl" }}
          color="brand.evergreen"
          fontFamily="var(--font-princess), cursive"
        >
          My Scrapbook
        </Heading>
        <HStack justify="center" spacing={2} mt={1}>
          <Text fontSize="sm" color="brand.slateGray">
            Arrastra, rota y escala tus recuerdos
          </Text>
          {saving ? (
            <HStack spacing={1}>
              <Spinner size="xs" color="brand.caramel" />
              <Text fontSize="xs" color="brand.caramel">
                Guardando...
              </Text>
            </HStack>
          ) : (
            <HStack spacing={1} opacity={0.5}>
              <Cloud size={12} />
              <Text fontSize="xs" color="brand.evergreen">
                Guardado
              </Text>
            </HStack>
          )}
        </HStack>
      </Box>

      <Box mb={{ base: 2, md: 4 }} px={{ base: 2, md: 4 }}>
        <PageNavigator
          pages={pages}
          currentPageIndex={currentPageIndex}
          isLoggedIn={isLoggedIn}
          onGoToPage={goToPage}
          onGoNext={goNext}
          onGoPrev={goPrev}
          onAddPage={addPage}
          onDeletePage={deletePage}
          onRenamePage={renamePage}
        />
      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 3, md: 5 }}
        align="flex-start"
        justify="center"
        maxW="1200px"
        mx="auto"
        px={{ base: 2, md: 4 }}
      >
        <Box
          w={{ base: "100%", md: "200px" }}
          flexShrink={0}
          order={{ base: 2, md: 1 }}
        >
          <Toolbar
            selectedId={selectedId}
            selectedElement={selectedElement}
            isLoggedIn={isLoggedIn}
            onAddImage={addImage}
            onAddText={() => addText()}
            onAddSticker={addSticker}
            onDelete={deleteSelected}
            onBringToFront={bringToFront}
            onSendToBack={sendToBack}
            onExport={exportToPng}
            onChangeTextColor={(color) =>
              selectedId && updateElement(selectedId, { fill: color })
            }
          />
        </Box>

        <Box
          ref={canvasContainerRef}
          flex="1"
          order={{ base: 1, md: 2 }}
          display="flex"
          justifyContent="center"
          w="100%"
          minW={0}
          overflow="hidden"
        >
          <ScrapbookCanvas
            key={currentPageIndex}
            width={stageDims.w}
            height={stageDims.h}
            elements={elements}
            selectedId={selectedId}
            stageRef={stageRef}
            onSelect={setSelectedId}
            onUpdate={updateElement}
            onDelete={deleteSelected}
            readonly={!isLoggedIn}
          />
        </Box>
      </Flex>
    </Box>
  );
}
