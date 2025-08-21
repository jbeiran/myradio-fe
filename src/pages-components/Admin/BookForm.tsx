"use client";

import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Button,
  Stack,
  Box,
  useToast,
} from "@chakra-ui/react";
import IconRating from "./IconRating";

const BookSchema = Yup.object({
  title: Yup.string().required("Título requerido").max(160),
  author: Yup.string().required("Autor requerido").max(120),
  rating: Yup.number().min(1).max(5).required("Rating requerido"),
  review: Yup.string().required("Reseña requerida").min(10),
  date: Yup.string().nullable(),
  gender: Yup.string(),
});

export default function BookForm() {
  const toast = useToast();
  const fieldBg = "white";

  return (
    <Formik
      initialValues={{
        title: "",
        author: "",
        rating: 3,
        review: "",
        date: "",
        gender: "",
      }}
      validationSchema={BookSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const res = await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error("Error al guardar");
          toast({ title: "Review de libro publicada", status: "success" });
          resetForm();
        } catch (e: any) {
          toast({
            title: e?.message || "No se pudo guardar",
            status: "error",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched, setFieldValue, values }) => (
        <Form noValidate>
          <VStack align="stretch" spacing={4}>
            <Field name="title">
              {({ field }: any) => (
                <FormControl isInvalid={!!errors.title && !!touched.title}>
                  <FormLabel htmlFor="title">Título</FormLabel>
                  <Input id="title" {...field} bg={fieldBg} />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="author">
              {({ field }: any) => (
                <FormControl isInvalid={!!errors.author && !!touched.author}>
                  <FormLabel htmlFor="author">Autor</FormLabel>
                  <Input id="author" {...field} bg={fieldBg} />
                  <FormErrorMessage>{errors.author}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              align="start"
            >
              <Box w={{ base: "100%", md: "35%" }}>
                <FormControl isInvalid={!!errors.rating && !!touched.rating}>
                  <FormLabel>Rating</FormLabel>
                  <IconRating
                    variant="book"
                    value={values.rating}
                    onChange={(n: number) => setFieldValue("rating", n)}
                  />
                  <FormErrorMessage>{errors.rating as any}</FormErrorMessage>
                </FormControl>
              </Box>

              <Box flex="1">
                <Field name="date">
                  {({ field }: any) => (
                    <FormControl isInvalid={!!errors.date && !!touched.date}>
                      <FormLabel htmlFor="date">Fecha</FormLabel>
                      <Input id="date" type="date" {...field} bg={fieldBg} />
                      <FormErrorMessage>{errors.date}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </Stack>

            <Field name="review">
              {({ field }: any) => (
                <FormControl isInvalid={!!errors.review && !!touched.review}>
                  <FormLabel htmlFor="review">Reseña</FormLabel>
                  <Textarea id="review" rows={8} {...field} bg={fieldBg} />
                  <FormErrorMessage>{errors.review}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="gender">
              {({ field }: any) => (
                <FormControl isInvalid={!!errors.gender && !!touched.gender}>
                  <FormLabel htmlFor="gender">Género</FormLabel>
                  <Input id="gender" {...field} bg={fieldBg} />
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              type="submit"
              colorScheme="pink"
              isLoading={isSubmitting}
              alignSelf={{ base: "stretch", md: "flex-end" }}
            >
              Publicar
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
}
