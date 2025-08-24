import { Box, Image, AspectRatio } from "@chakra-ui/react";
import { KeyboardEvent } from "react";

type Props = {
  src: string;
  alt: string;
  onOpen: () => void;
};

export const PhotoCard = ({ src, alt, onOpen }: Props) => {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const FRAME_AREA = {
    width: "70%",
    height: "75%",
    topOffset: "55%",
  };

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      cursor="zoom-in"
      _focusVisible={{ boxShadow: "outline" }}
      transition="transform .18s ease"
      _hover={{ transform: "translateY(-2px)" }}
      w="100%"
    >
      <AspectRatio
        ratio={768 / 993}
        w="100%"
        maxW={{ base: "380px", md: "560px" }}
      >
        <Box
          position="relative"
          bgImage="/assets/images/bg-pic.png"
          bgRepeat="no-repeat"
          bgPos="center"
          bgSize="contain"
          filter="drop-shadow(0 8px 18px rgba(0,0,0,.18))"
        >
          <Box
            position="absolute"
            top={FRAME_AREA.topOffset}
            left="47%"
            w={FRAME_AREA.width}
            h={FRAME_AREA.height}
            transform="translate(-50%, -50%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(250, 250, 250, 0.43)"
            borderRadius="8px"
          >
            <Image
              src={src}
              alt={alt}
              w="100%"
              h="100%"
              objectFit="contain"
              objectPosition="center"
              borderRadius="6px"
              boxShadow="0 2px 8px rgba(0,0,0,0.15)"
              loading="lazy"
              draggable={false}
              transition="opacity 0.3s ease"
            />
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  );
};
