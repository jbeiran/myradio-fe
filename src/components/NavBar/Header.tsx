"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import type { ElementType } from "react";

export default function Header() {
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
    </Box>
  );
}
