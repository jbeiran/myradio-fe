import { Box, Container, Flex } from "@chakra-ui/react";
import React from "react";

import Header from "@/components/NavBar/Header";
import Nav from "@/components/NavBar/Nav";
import Footer from "@/components/Footer";

type MainTemplateProps = { children: React.ReactNode };

export const MainTemplate = (props: MainTemplateProps) => {
  const { children } = props;
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <Nav />
      <Box as="main" flex="1" layerStyle="main">
        <Container>{children}</Container>
      </Box>
      <Footer />
    </Flex>
  );
};
