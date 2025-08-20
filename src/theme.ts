import { extendTheme, defineStyle, defineStyleConfig } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-princess), cursive",
    body: "var(--font-princess), cursive",
  },
  styles: {
    global: {
      html: { scrollBehavior: "smooth" },
      body: {
        bg: "brand.creamSweater",
        color: "brand.slateGray",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      },
      main: { flex: "1 0 auto" },
    },
  },
  colors: {
    brand: {
      roseDust: "#c78c8c",
      caramel: "#a86e3d",
      mustardVintage: "#c29a3a",
      evergreen: "#2f5d3a",
      creamSweater: "#f4e9d8",
      slateGray: "#5b6770",
    },
  },
});
