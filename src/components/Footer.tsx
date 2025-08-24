import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" layerStyle="footer">
      <Container>
        <Text variant="subtitle">
          &copy; 2025 La Radio de Saki | My 2000s Radio
        </Text>
      </Container>
    </Box>
  );
}
