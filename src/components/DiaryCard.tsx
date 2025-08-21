import NextLink from "next/link";
import {
  Box,
  Heading,
  Text,
  HStack,
  Badge,
  Link,
  Flex,
} from "@chakra-ui/react";

export type DiaryItem = {
  _id: string;
  title: string;
  content: string;
  tags?: string;
  date?: string | null;
  createdAt?: string | null;
};

function formatDate(input?: string | null) {
  if (!input) return "";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

const paperImages = [
  "/assets/images/sticker-papers/paper1.png",
  "/assets/images/sticker-papers/paper2.png",
  "/assets/images/sticker-papers/paper3.png",
  "/assets/images/sticker-papers/paper4.png",
];
const paperBgColors = ["#e9e0cf", "#ead8b9", "#cbb69d", "#e8dcc6"];

export function DiaryCard({
  item,
  paperIndex = 0,
}: {
  item: DiaryItem;
  paperIndex?: number;
}) {
  const excerptMax = 220;
  const excerpt =
    item.content.length > excerptMax
      ? item.content.slice(0, excerptMax).trim() + "…"
      : item.content;

  const tags =
    (item.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean) || [];

  const dateLabel = formatDate(item.date || item.createdAt);
  const bgPaper = paperImages[Math.abs(paperIndex) % paperImages.length];
  const bgColor = paperBgColors[Math.abs(paperIndex) % paperBgColors.length];

  return (
    <Box
      position="relative"
      bgImage={`url('${bgPaper}')`}
      backgroundRepeat="no-repeat"
      backgroundSize={{ base: "145% 145%", md: "135% 135%" }}
      backgroundPosition="center"
      backgroundColor={bgColor}
      border="2px dashed"
      borderColor="brand.caramel"
      boxShadow="0 6px 14px rgba(47,93,58,0.18)"
      p={{ base: 4, md: 6 }}
      transition="all 200ms ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 10px 18px rgba(47,93,58,0.28)",
      }}
      display="flex"
      flexDirection="column"
      minHeight="250px"
      borderRadius="md"
      overflow="hidden"
    >
      <Flex align="baseline" mb={5} gap={3}>
        <Text fontSize="sm" color="brand.slateGray">
          {dateLabel}
        </Text>
      </Flex>

      <Heading size="lg" color="brand.evergreen" textShadow="1px 1px #f0e2cf">
        <Link
          as={NextLink}
          href={`/diary/${item._id}`}
          _hover={{ textDecoration: "none", color: "brand.mustardVintage" }}
        >
          {item.title}
        </Link>
      </Heading>

      <Text mt={3} color="brand.slateGray" flex="1">
        {excerpt}
      </Text>

      <HStack mt={4} spacing={2} flexWrap="wrap">
        {tags.map((t) => (
          <Badge key={t} colorScheme="pink" variant="solid">
            #{t}
          </Badge>
        ))}
      </HStack>

      <Link
        as={NextLink}
        href={`/diary/${item._id}`}
        mt={4}
        display="inline-block"
        color="brand.caramel"
        fontWeight="bold"
      >
        Leer más →
      </Link>
    </Box>
  );
}
