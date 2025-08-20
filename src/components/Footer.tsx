import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" layerStyle="footer">
      <Container>
        <Text variant="subtitle">
          &copy; 2025 My 2000s World | Glitter & Pink Vibes
        </Text>
      </Container>
    </Box>
  );
}
