"use client";

import React from "react";
import { HStack, IconButton, Icon } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";

type IconRatingProps = {
  value: number;
  onChange: (n: number) => void;
  variant?: "star" | "book";
};

const BookOpenOutlineIcon = (props: React.ComponentProps<typeof Icon>) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5c-2.5-1.5-5.5-2-9-2v14c3.5 0 6.5.5 9 2 2.5-1.5 5.5-2 9-2V3c-3.5 0-6.5.5-9 2Z"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      d="M12 5v14"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeOpacity=".6"
      strokeWidth="1.2"
      strokeLinecap="round"
      d="M5.5 7.5c2.2.1 4.2.5 6.5 1.5M18.5 7.5c-2.2.1-4.2.5-6.5 1.5"
    />
  </Icon>
);

const BookOpenFilledIcon = (props: React.ComponentProps<typeof Icon>) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 5c-2.5-1.5-5.5-2-9-2v14c3.5 0 6.5.5 9 2 2.5-1.5 5.5-2 9-2V3c-3.5 0-6.5.5-9 2Z"
    />
    <path
      fill="none"
      stroke="white"
      strokeOpacity=".9"
      strokeWidth="1.6"
      strokeLinecap="round"
      d="M12 5v14"
    />
    <path
      fill="none"
      stroke="white"
      strokeOpacity=".65"
      strokeWidth="1.2"
      strokeLinecap="round"
      d="M5.5 7.5c2.2.1 4.2.5 6.5 1.5M18.5 7.5c-2.2.1-4.2.5-6.5 1.5"
    />
  </Icon>
);

export default function IconRating({
  value,
  onChange,
  variant = "star",
}: IconRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") onChange(Math.min(5, value + 1));
    if (e.key === "ArrowLeft") onChange(Math.max(1, value - 1));
  };

  const labelUnit = variant === "book" ? "libro" : "estrella";

  return (
    <HStack
      spacing={1.5}
      role="radiogroup"
      aria-label="Valoración"
      onKeyDown={handleKey}
    >
      {stars.map((n) => {
        const active = n <= value;
        const iconEl =
          variant === "book" ? (
            active ? (
              <BookOpenFilledIcon />
            ) : (
              <BookOpenOutlineIcon />
            )
          ) : (
            <StarIcon />
          );

        return (
          <IconButton
            key={n}
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} ${labelUnit}${n > 1 ? "s" : ""}`}
            icon={iconEl}
            variant="ghost"
            isRound
            size="sm"
            fontSize={variant === "book" ? "2xl" : "xl"}
            tabIndex={n === value ? 0 : -1}
            color={active ? "brand.mustardVintage" : "gray.500"}
            _hover={{ color: "brand.mustardVintage", transform: "scale(1.08)" }}
            _active={{ transform: "scale(0.98)" }}
            _focusVisible={{
              outline: "2px solid",
              outlineColor: "brand.evergreen",
              outlineOffset: "2px",
            }}
            onClick={() => onChange(n)}
          />
        );
      })}
    </HStack>
  );
}
