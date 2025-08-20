"use client";

import NextLink from "next/link";
import { Box, Heading, Text, HStack, Link } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";

const links = [
  { href: "/", label: "Así soy" },
  { href: "/blog", label: "Mi Diario" },
  { href: "/gallery", label: "Fotitos" },
  { href: "/books", label: "Libros" },
  { href: "/movies", label: "Pelis" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <Box
      as="header"
      bg="brand.caramel"
      color="white"
      px={5}
      pt={2}
      pb={5}
      textAlign="center"
      boxShadow="0 4px 8px rgba(0,0,0,0.1)"
      borderBottom="3px dashed"
      borderBottomColor="brand.evergreen"
    >
      <Box
        as={"marquee" as ElementType}
        behavior="scroll"
        direction="left"
        scrollamount="4"
        color="white"
        fontWeight="bold"
        textShadow="1px 1px #a86e3d"
      >
        I can be flexible, as long as everything is exactly the way I want it.
      </Box>

      <Heading
        mt={1}
        fontSize={{ base: "2.5em", md: "3em" }}
        textShadow="1px 1px 3px rgba(168,110,61,0.3)"
      >
        ‎‧₊˚✧My 2000s Radio‎‧₊˚✧
      </Heading>
      <Text>~ Life’s short. Talk fast ~</Text>

      <HStack as="nav" justify="center" spacing={3} mt={5}>
        {links.map((l) => {
          const active =
            l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
          return (
            <Link
              as={NextLink}
              key={l.href}
              href={l.href}
              bg={active ? "brand.roseDust" : "brand.evergreen"}
              color="white"
              px={5}
              py={2.5}
              fontWeight="bold"
              textDecoration="none"
              border="2px solid"
              borderColor="white"
              borderBottomColor="brand.evergreen"
              borderRightColor="brand.evergreen"
              boxShadow="0 6px 14px rgba(47,93,58,0.35), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.12)"
              position="relative"
              _hover={{
                bg: "brand.mustardVintage",
                color: "brand.evergreen",
                transform: "translateY(-1px) scale(1.05)",
                boxShadow:
                  "0 10px 18px rgba(47,93,58,0.4), inset 0 2px 0 rgba(255,255,255,0.7)",
              }}
              _active={{
                transform: "translateY(1px) scale(0.98)",
                boxShadow:
                  "0 3px 8px rgba(47,93,58,0.3), inset 0 2px 4px rgba(0,0,0,0.2)",
              }}
              sx={{
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  pointerEvents: "none",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.05))",
                },
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </HStack>
    </Box>
  );
}
