"use client";

import dynamic from "next/dynamic";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { MainTemplate } from "@/templates/MainTemplate";

/**
 * Konva relies on the browser Canvas API and `window`,
 * so we must disable SSR for the editor component.
 */
const ScrapbookEditor = dynamic(
  () => import("@/components/Scrapbook/ScrapbookEditor"),
  {
    ssr: false,
    loading: () => (
      <Center py={20}>
        <Spinner size="xl" color="brand.evergreen" />
      </Center>
    ),
  }
);

export default function ScrapbookPage() {
  return (
    <MainTemplate>
      <Box minH="80vh">
        <ScrapbookEditor />
      </Box>
    </MainTemplate>
  );
}
