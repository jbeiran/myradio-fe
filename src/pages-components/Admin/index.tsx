"use client";

import React, { FC } from "react";
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import DiaryForm from "./DiaryForm";
import BookForm from "./BookForm";
import MovieForm from "./MovieForm";
import PhotoUploader from "./PhotoUploader";

const AdminPage: FC = () => {
  const adminTabProps = {
    minW: { base: "120px", md: "auto" },
    fontWeight: "semibold",
    border: "1px solid",
    borderColor: "brand.evergreen",
    borderBottomColor: "transparent",
    borderTopRadius: "md",
    bg: "brand.creamSweater",
    _selected: {
      bg: "brand.roseDust",
      color: "white",
      borderColor: "brand.evergreen",
    },
  } as const;

  return (
    <Container maxW="4xl" py={6}>
      <Box layerStyle="panel">
        <Heading as="h2" color="brand.evergreen" mb={1}>
          Panel de Admin
        </Heading>
        <Text mb={6} color="brand.slateGray">
          Publica entradas del diario, sube fotos y escribe tus reviews de
          libros y pelis.
        </Text>

        <Tabs isFitted isLazy>
          <TabList gap={2} overflowX={{ base: "auto", md: "visible" }} py={1}>
            <Tab {...adminTabProps}>Diario</Tab>
            <Tab {...adminTabProps}>Fotos</Tab>
            <Tab {...adminTabProps}>Libros</Tab>
            <Tab {...adminTabProps}>Pelis</Tab>
          </TabList>

          <TabPanels
            bg="whiteAlpha.800"
            border="1px solid"
            borderColor="brand.evergreen"
            borderTop="none"
            borderBottomRadius="md"
            p={{ base: 4, md: 6 }}
          >
            <TabPanel>
              <Heading size="md" mb={4} color="brand.evergreen">
                Nueva entrada del diario
              </Heading>
              <DiaryForm />
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4} color="brand.evergreen">
                Subir fotos
              </Heading>
              <PhotoUploader />
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4} color="brand.evergreen">
                Nueva review de libro
              </Heading>
              <BookForm />
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4} color="brand.evergreen">
                Nueva review de peli
              </Heading>
              <MovieForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default AdminPage;
