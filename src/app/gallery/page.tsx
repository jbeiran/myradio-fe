"use client";

export const dynamic = "force-dynamic";

import { MainTemplate } from "@/templates/MainTemplate";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Spinner,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Pagination } from "@/components/Pagination";
import { PhotoCard } from "@/components/PhotoCard";

type GalleryItem = {
  _id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  alt?: string;
  title?: string;
};

function GalleryList() {
  const { items, loading, error, page, totalPages, goTo } =
    usePaginatedList<GalleryItem>("gallery", { limit: 12 });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState<GalleryItem | null>(null);

  const openItem = (it: GalleryItem) => {
    setActive(it);
    onOpen();
  };

  return (
    <Box layerStyle="panel">
      <Heading
        size="2xl"
        color="brand.evergreen"
        textAlign="center"
        mb={2}
        textShadow="1px 1px 3px rgba(168,110,61,0.3)"
      >
        Galería
      </Heading>
      <Text textAlign="center" color="brand.slateGray" mb={6}>
        Fotos subidas
      </Text>

      {loading && (
        <HStack justify="center" py={10}>
          <Spinner color="brand.caramel" />
          <Text>Cargando…</Text>
        </HStack>
      )}

      {!loading && error && (
        <Box textAlign="center" color="red.600" py={6}>
          {error}
        </Box>
      )}

      {!loading && !error && (
        <>
          <SimpleGrid
            minChildWidth={{ base: "300px", md: "360px" }}
            spacing={{ base: 5, md: 7 }}
            justifyItems="center"
          >
            {items.map((it) => (
              <PhotoCard
                key={it._id}
                src={it.url}
                alt={it.title || it.alt || "Foto"}
                onOpen={() => openItem(it)}
              />
            ))}
          </SimpleGrid>
          <Pagination page={page} totalPages={totalPages} onChange={goTo} />
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw">
          <ModalBody
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {active && (
              <Image
                src={active.url}
                alt={active.title || active.alt || "Foto"}
                maxH="80vh"
                maxW="90vw"
                objectFit="contain"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default function GalleryListPage() {
  return (
    <MainTemplate>
      <Suspense
        fallback={
          <HStack justify="center" py={10}>
            <Spinner color="brand.caramel" />
            <Text>Cargando…</Text>
          </HStack>
        }
      >
        <GalleryList />
      </Suspense>
    </MainTemplate>
  );
}
