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

const DiarySchema = Yup.object({
  title: Yup.string().required("Título requerido").max(120),
  content: Yup.string().required("Contenido requerido").min(20),
  tags: Yup.string().max(200),
  date: Yup.string().nullable(),
});

export default function DiaryForm() {
  const toast = useToast();
  const fieldBg = "white";

  return (
    <Formik
      initialValues={{ title: "", content: "", tags: "", date: "" }}
      validationSchema={DiarySchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          const res = await fetch("/api/diary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) throw new Error("Error al publicar");
          toast({ title: "Entrada publicada", status: "success" });
          resetForm();
        } catch (e: any) {
          toast({
            title: e?.message || "No se pudo publicar",
            status: "error",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
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

            <Field name="content">
              {({ field }: any) => (
                <FormControl isInvalid={!!errors.content && !!touched.content}>
                  <FormLabel htmlFor="content">Contenido</FormLabel>
                  <Textarea id="content" rows={10} {...field} bg={fieldBg} />
                  <FormErrorMessage>{errors.content}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              align="start"
            >
              <Box flex="1">
                <Field name="tags">
                  {({ field }: any) => (
                    <FormControl isInvalid={!!errors.tags && !!touched.tags}>
                      <FormLabel htmlFor="tags">
                        Tags (separados por coma)
                      </FormLabel>
                      <Input
                        id="tags"
                        placeholder="personal, viajes,..."
                        {...field}
                        bg={fieldBg}
                      />
                      <FormErrorMessage>{errors.tags}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>

              <Box w={{ base: "100%", md: "30%" }}>
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
