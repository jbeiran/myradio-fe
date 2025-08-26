import { Box, Image, AspectRatio } from "@chakra-ui/react";

type Props = {
  src: string;
  alt: string;
  onOpen: () => void;
};

export const PhotoCard = ({ src, alt, onOpen }: Props) => {
  const INSET = { top: "20%", right: "10%", bottom: "12%", left: "18%" };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      cursor="zoom-in"
      _focusVisible={{ boxShadow: "outline" }}
      transition="transform .18s ease"
      w="100%"
    >
      <AspectRatio
        ratio={993 / 768}
        w="100%"
        maxW={{ base: "380px", md: "560px" }}
      >
        <Box position="relative">
          <Image
            src="/assets/images/bg-pic.png"
            alt=""
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit="contain"
            transform="rotate(270deg)"
            transformOrigin="center"
            zIndex={0}
            pointerEvents="none"
            draggable={false}
          />

          <Box
            position="absolute"
            top={INSET.top}
            right={INSET.right}
            bottom={INSET.bottom}
            left={INSET.left}
            zIndex={1}
            overflow="hidden"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={src}
              alt={alt}
              w="75%"
              h="75%"
              objectFit="cover"
              objectPosition="center"
              loading="lazy"
              draggable={false}
            />
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  );
};
