"use client";

export const dynamic = "force-dynamic";

import { MainTemplate } from "@/templates/MainTemplate";
import { Box } from "@chakra-ui/react";
import { Suspense } from "react";

function GalleryList() {
  return <Box layerStyle="panel"></Box>;
}

export default function GalleryListPage() {
  return (
    <MainTemplate>
      <Suspense>
        <GalleryList />
      </Suspense>
    </MainTemplate>
  );
}
