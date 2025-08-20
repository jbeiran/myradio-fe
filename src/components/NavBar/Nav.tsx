"use client";

import NextLink from "next/link";
import {
  Box,
  Container,
  HStack,
  Link,
  IconButton,
  Stack,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
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
  const { isOpen, onToggle } = useDisclosure();

  const renderLink = (l: { href: string; label: string }, mobile = false) => {
    const active =
      l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
    return (
      <Link
        as={NextLink}
        key={l.href}
        href={l.href}
        aria-current={active ? "page" : undefined}
        variant="nav"
        w={mobile ? "full" : "auto"}
      >
        {l.label}
      </Link>
    );
  };

  return (
    <Box as="nav" mt={5} mb={2}>
      <Container>
        <Box display={{ base: "block", md: "none" }} textAlign="center">
          <IconButton
            onClick={onToggle}
            variant="navToggle"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            size="md"
          />
        </Box>

        <Collapse in={isOpen} animateOpacity>
          <Stack
            display={{ base: "flex", md: "none" }}
            spacing={2}
            mt={3}
            w="full"
            align="stretch"
          >
            {links.map((l) => renderLink(l, true))}
          </Stack>
        </Collapse>

        <HStack
          justify="center"
          spacing={3}
          mt={{ base: 3, md: 5 }}
          mb={2}
          display={{ base: "none", md: "flex" }}
        >
          {links.map((l) => renderLink(l))}
        </HStack>
      </Container>
    </Box>
  );
}
