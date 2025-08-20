import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <main>
      <Box as="section" id="about" py={10} textAlign="center">
        <Heading
          as="h2"
          color="brand.evergreen"
          fontSize="2em"
          mb={5}
          textShadow="1px 1px 3px rgba(168,110,61,0.3)"
        >
          Así soy
        </Heading>

        <Container
          maxW="640px"
          bg="white"
          border="2px dashed"
          borderColor="brand.evergreen"
          boxShadow="0 0 15px rgba(47,93,58,0.2)"
          transition="all 0.3s cubic-bezier(0.4,0,0.2,1)"
          _hover={{
            transform: "scale(1.03)",
            boxShadow: "0 0 20px rgba(200,140,140,0.4)",
          }}
          p={5}
        >
          <Text>
            Hola! Soy una chica amante de los 2000s. Me gusta la moda, los gifs
            brillantes y MySpace vibes.
          </Text>
        </Container>
      </Box>
    </main>
  );
}
