import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg="brand.caramel"
      color="white"
      py={5}
      textAlign="center"
      fontSize="0.9em"
      borderTop="3px dashed"
      borderTopColor="brand.evergreen"
    >
      <Text>&copy; 2025 My 2000s World | Glitter & Pink Vibes</Text>
    </Box>
  );
}
