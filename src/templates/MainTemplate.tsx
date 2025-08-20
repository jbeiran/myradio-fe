import { Box } from "@chakra-ui/react";
import React from "react";

import Header from "@/components/NavBar/Header";
import Nav from "@/components/NavBar/Nav";

import Footer from "@/components/Footer";

type MainTemplateProps = { children: React.ReactNode };

export const MainTemplate = (props: MainTemplateProps) => {
  const { children } = props;
  return (
    <Box>
      <Header />
      <Nav />
      <main style={{ paddingTop: "5px" }}>{children}</main>
      <Footer />
    </Box>
  );
};
