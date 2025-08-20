"use client";

import NextLink from "next/link";
import { HStack, Link } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Así soy" },
  { href: "/blog", label: "Mi Diario" },
  { href: "/gallery", label: "Fotitos" },
  { href: "/books", label: "Libros" },
  { href: "/movies", label: "Pelis" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <HStack as="nav" justify="center" spacing={3} mt={5} mb={2}>
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
  );
}
