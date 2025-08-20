import {
  extendTheme,
  defineStyle,
  defineStyleConfig,
  createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { inputAnatomy } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);
const linkNavVariant = defineStyle({
  bg: "brand.evergreen",
  color: "white",
  textDecoration: "none",
  border: "2px solid",
  borderColor: "white",
  borderBottomColor: "brand.evergreen",
  borderRightColor: "brand.evergreen",
  boxShadow:
    "0 6px 14px rgba(47,93,58,0.35), inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.12)",
  position: "relative",
  textAlign: "center",
  px: { base: 4, md: 5 },
  py: { base: 2, md: 2.5 },
  fontWeight: "bold",
  _hover: {
    bg: "brand.mustardVintage",
    color: "brand.evergreen",
    transform: "translateY(-1px) scale(1.05)",
    boxShadow:
      "0 10px 18px rgba(47,93,58,0.4), inset 0 2px 0 rgba(255,255,255,0.7)",
  },
  _active: {
    transform: "translateY(1px) scale(0.98)",
    boxShadow: "0 3px 8px rgba(47,93,58,0.3), inset 0 2px 4px rgba(0,0,0,0.2)",
  },
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
  "&[aria-current=page]": {
    bg: "brand.roseDust",
  },
});

const linkTheme = defineStyleConfig({
  baseStyle: {
    cursor: 'url("/assets/cursors/link.cur"), pointer',
    _hover: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
    _active: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
  },
  variants: {
    nav: linkNavVariant,
  },
});

const iconButtonTheme = defineStyleConfig({
  baseStyle: {
    cursor: 'url("/assets/cursors/link.cur"), pointer',
    _hover: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
    _active: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
    _disabled: { cursor: 'url("/assets/cursors/unavail.cur"), not-allowed' },
  },
  variants: {
    navToggle: defineStyle({
      borderWidth: "1px",
      borderColor: "brand.evergreen",
      color: "brand.evergreen",
      _hover: { bg: "brand.creamSweater" },
    }),
  },
});

const buttonTheme = defineStyleConfig({
  baseStyle: {
    cursor: 'url("/assets/cursors/link.cur"), pointer',
    _hover: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
    _active: { cursor: 'url("/assets/cursors/pen.cur"), pointer' },
    _disabled: { cursor: 'url("/assets/cursors/unavail.cur"), not-allowed' },
  },
});

const headingTheme = defineStyleConfig({
  variants: {
    siteTitle: defineStyle({
      mt: 1,
      fontSize: { base: "2.5em", md: "3em" },
      textShadow: "1px 1px 3px rgba(168,110,61,0.3)",
    }),
  },
});

const textTheme = defineStyleConfig({
  variants: {
    subtitle: defineStyle({
      fontSize: { base: "sm", md: "md" },
    }),
    marquee: defineStyle({
      color: "white",
      fontWeight: "bold",
      textShadow: "1px 1px #a86e3d",
      fontSize: { base: "sm", md: "md" },
    }),
  },
});

const containerTheme = defineStyleConfig({
  baseStyle: {
    px: { base: 4, md: 6 },
    maxW: "container.lg",
  },
});

const inputTheme = defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    field: {
      _focusVisible: {
        borderColor: "brand.evergreen",
        boxShadow: "0 0 0 1px var(--chakra-colors-brand-evergreen)",
      },
    },
  }),
});

const textareaTheme = defineStyleConfig({
  baseStyle: {
    _focusVisible: {
      borderColor: "brand.evergreen",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-evergreen)",
    },
  },
});

const tabsTheme = defineStyleConfig({
  defaultProps: {
    variant: "enclosed",
    colorScheme: "pink",
  },
});

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-princess), cursive",
    body: "var(--font-garamond), serif",
  },
  styles: {
    global: {
      html: { scrollBehavior: "smooth" },
      body: {
        bg: "brand.creamSweater",
        backgroundImage: 'url("/assets/images/background.png")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "brand.slateGray",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: 'url("/assets/cursors/link.cur"), pointer',
      },
      main: { flex: "1 0 auto" },
    },
  },
  layerStyles: {
    header: {
      bg: "brand.caramel",
      color: "white",
      px: 0,
      pt: 2,
      pb: 5,
      textAlign: "center",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      borderBottom: "3px dashed",
      borderBottomColor: "brand.evergreen",
    },
    footer: {
      bg: "brand.caramel",
      color: "white",
      py: 5,
      textAlign: "center",
      fontSize: "0.9em",
      borderTop: "3px dashed",
      borderTopColor: "brand.evergreen",
    },
    main: {
      py: { base: 3, md: 4 },
    },
    // NEW: reusable panel style for Admin containers
    panel: {
      bg: "whiteAlpha.900",
      border: "1px solid",
      borderColor: "brand.evergreen",
      borderRadius: "lg",
      boxShadow: "0 6px 14px rgba(47,93,58,0.18)",
      p: { base: 4, md: 6 },
    },
  },
  components: {
    Link: linkTheme,
    Button: buttonTheme,
    IconButton: iconButtonTheme,
    Heading: headingTheme,
    Text: textTheme,
    Container: containerTheme,
    // NEW
    Input: inputTheme,
    Textarea: textareaTheme,
    Tabs: tabsTheme,
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
