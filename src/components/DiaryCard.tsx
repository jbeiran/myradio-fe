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
const paperBgColors = ["#e9e0cf", "#ead8b9", "#B59579", "#e8dcc6"];

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
      <Flex align="baseline" mb={4} gap={3}>
        <Text fontSize="sm" color="brand.slateGray" fontWeight="bold">
          {dateLabel}
        </Text>
      </Flex>

      <Heading
        size="xl"
        fontWeight="extrabold"
        color="brand.evergreen"
        letterSpacing="0.2px"
        lineHeight="1.2"
        fontFamily=""
      >
        <Link
          as={NextLink}
          href={`/diary/${item._id}`}
          _hover={{ textDecoration: "none", color: "brand.mustardVintage" }}
        >
          {item.title}
        </Link>
      </Heading>

      <Text
        mt={3}
        color="black"
        lineHeight="1.8"
        flex="1"
        fontSize="lg"
        fontWeight="medium"
        textShadow="0 1px 2px rgba(255,255,255,0.8)"
      >
        {excerpt}
      </Text>

      <HStack mt={4} spacing={2} flexWrap="wrap">
        {tags.map((t) => (
          <Badge
            key={t}
            bg="brand.evergreen"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            textShadow="0 1px 1px rgba(0,0,0,0.2)"
          >
            #{t}
          </Badge>
        ))}
      </HStack>

      <Link
        as={NextLink}
        href={`/diary/${item._id}`}
        mt={4}
        display="inline-block"
        color="brand.evergreen"
        fontWeight="bold"
        fontSize="md"
        textShadow="0 1px 2px rgba(255,255,255,0.7)"
        _hover={{ color: "brand.caramel", textDecoration: "underline" }}
      >
        Leer más →
      </Link>
    </Box>
  );
}
