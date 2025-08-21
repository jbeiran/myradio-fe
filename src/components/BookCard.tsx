import NextLink from "next/link";
import { Box, Heading, Text, Badge, Link, Flex } from "@chakra-ui/react";
import IconRating from "@/components/IconRating";

export type BookItem = {
  _id: string;
  title: string;
  author: string;
  rating: number;
  review: string;
  date?: string | null;
  gender?: string;
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

export function BookCard({ item }: { item: BookItem }) {
  const excerptMax = 220;
  const excerpt =
    item.review.length > excerptMax
      ? item.review.slice(0, excerptMax).trim() + "…"
      : item.review;

  const dateLabel = formatDate(item.date || item.createdAt);

  return (
    <Box
      position="relative"
      bg="whiteAlpha.900"
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
    >
      <Flex align="center" justify="space-between" mb={3} gap={3}>
        <Text fontSize="sm" color="brand.slateGray">
          {dateLabel}
        </Text>
        {item.gender ? (
          <Badge colorScheme="pink" variant="solid">
            {item.gender}
          </Badge>
        ) : null}
      </Flex>

      <Heading size="lg" color="brand.evergreen" textShadow="1px 1px #f0e2cf">
        <Link
          as={NextLink}
          href={`/books/${item._id}`}
          _hover={{ textDecoration: "none", color: "brand.mustardVintage" }}
        >
          {item.title}
        </Link>
      </Heading>

      <Text mt={1} color="brand.slateGray" fontStyle="italic">
        Autor: {item.author}
      </Text>

      <Box mt={3} pointerEvents="none">
        <IconRating
          value={Math.max(1, Math.min(5, item.rating || 1))}
          onChange={() => {}}
          variant="book"
        />
      </Box>

      <Text mt={3} color="brand.slateGray" flex="1">
        {excerpt}
      </Text>

      <Link
        as={NextLink}
        href={`/books/${item._id}`}
        mt={4}
        display="inline-block"
        color="brand.caramel"
        fontWeight="bold"
      >
        Leer reseña →
      </Link>
    </Box>
  );
}
