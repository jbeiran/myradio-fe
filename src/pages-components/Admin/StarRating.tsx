"use client";

import React from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

type StarRatingProps = {
  value: number;
  onChange: (n: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") onChange(Math.min(5, value + 1));
    if (e.key === "ArrowLeft") onChange(Math.max(1, value - 1));
  };

  return (
    <HStack
      spacing={1.5}
      role="radiogroup"
      aria-label="Valoración"
      onKeyDown={handleKey}
    >
      {stars.map((n) => (
        <IconButton
          key={n}
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
          icon={<StarIcon />}
          variant="ghost"
          isRound
          size="sm"
          fontSize="xl"
          tabIndex={n === value ? 0 : -1}
          color={n <= value ? "brand.mustardVintage" : "gray.500"}
          _hover={{ color: "brand.mustardVintage", transform: "scale(1.08)" }}
          _active={{ transform: "scale(0.98)" }}
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "brand.evergreen",
            outlineOffset: "2px",
          }}
          onClick={() => onChange(n)}
        />
      ))}
    </HStack>
  );
}
