"use client";

import { Box, Container, Heading, Text } from "@chakra-ui/react";
import type { ElementType } from "react";

export default function Header() {
  return (
    <Box as="header" layerStyle="header">
      <Container>
        <Box
          as={"marquee" as ElementType}
          behavior="scroll"
          direction="left"
          scrollamount="4"
          textStyle="marquee"
        >
          I can be flexible, as long as everything is exactly the way I want it.
        </Box>

        <Heading variant="siteTitle">‎‧₊˚✧My 2000s Radio‎‧₊˚✧</Heading>
        <Text variant="subtitle">~ Life’s short. Talk fast ~</Text>
      </Container>
    </Box>
  );
}
