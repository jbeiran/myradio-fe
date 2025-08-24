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
  ModalCloseButton,
  IconButton,
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Suspense, useRef, useState } from "react";
import { usePaginatedList } from "@/hooks/usePaginatedList";
import { Pagination } from "@/components/Pagination";
import { PhotoCard } from "@/components/PhotoCard";
import { useSession } from "next-auth/react";

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
  const {
    items,
    loading,
    error,
    page,
    totalPages,
    goTo,
    filters,
    applyFilters,
  } = usePaginatedList<GalleryItem>("gallery", { limit: 12 });

  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "admin";

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = useState<GalleryItem | null>(null);

  const toast = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const openItem = (it: GalleryItem) => {
    setActive(it);
    onOpen();
  };

  const requestDelete = (id: string) => setConfirmId(id);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      const res = await fetch(`/api/gallery/${confirmId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar la imagen");
      toast({ status: "success", title: "Imagen eliminada" });
      applyFilters({ ...filters, _ts: Date.now() });
    } catch (e: any) {
      toast({ status: "error", title: e?.message || "Error al eliminar" });
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
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

      {!loading && !error && items.length === 0 && (
        <Box textAlign="center" py={10} color="brand.slateGray">
          No hay fotos todavía.
        </Box>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <SimpleGrid
            minChildWidth={{ base: "300px", md: "360px" }}
            spacing={{ base: 5, md: 7 }}
            justifyItems="center"
          >
            {items.map((it) => (
              <Box
                key={it._id}
                position="relative"
                w="100%"
                maxW={{ base: "380px", md: "560px" }}
              >
                {isAdmin && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="green"
                    position="absolute"
                    top="2"
                    right="2"
                    zIndex={2}
                    isLoading={deletingId === it._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDelete(it._id);
                    }}
                  />
                )}
                <PhotoCard
                  src={it.url}
                  alt={it.title || it.alt || "Foto"}
                  onOpen={() => openItem(it)}
                />
              </Box>
            ))}
          </SimpleGrid>
          <Pagination page={page} totalPages={totalPages} onChange={goTo} />
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(2px)" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw">
          <ModalCloseButton color="white" />
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
                borderRadius="6px"
                boxShadow="0 18px 40px rgba(0,0,0,0.35)"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={!!confirmId}
        leastDestructiveRef={cancelRef as any}
        onClose={() => setConfirmId(null)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar imagen
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Seguro que quieres eliminar esta imagen? Esta acción no se puede
              deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmId(null)}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={!!deletingId}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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
