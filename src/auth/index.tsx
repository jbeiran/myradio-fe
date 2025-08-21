"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";

const Schema = Yup.object({
  username: Yup.string().required("Usuario requerido").min(3).max(64),
  password: Yup.string().required("Contraseña requerida").min(6).max(128),
});

export default function SignIn() {
  const { login, authenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const callbackUrl = searchParams?.get("callbackUrl") || "/admin";

  useEffect(() => {
    if (authenticated) {
      router.replace(callbackUrl);
    }
  }, [authenticated, router, callbackUrl]);

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={20}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      bg="whiteAlpha.200"
      backdropFilter="blur(6px)"
    >
      <Heading size="md" mb={4}>
        Acceder
      </Heading>

      {serverError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {serverError}
        </Alert>
      )}

      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          setServerError(null);
          try {
            const res = await login(
              values.username.trim(),
              values.password,
              callbackUrl
            );
            if (res?.ok && res?.url) {
              router.replace(res.url);
            } else if (res?.error) {
              setServerError("Credenciales inválidas.");
            } else {
              router.replace(callbackUrl);
            }
          } catch {
            setServerError("No se pudo iniciar sesión. Inténtalo de nuevo.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form noValidate>
            <VStack spacing={4} align="stretch">
              <Field name="username">
                {({ field }: any) => (
                  <FormControl
                    isInvalid={!!errors.username && !!touched.username}
                  >
                    <FormLabel htmlFor="username">Usuario</FormLabel>
                    <Input
                      id="username"
                      autoComplete="username"
                      {...field}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field name="password">
                {({ field }: any) => (
                  <FormControl
                    isInvalid={!!errors.password && !!touched.password}
                  >
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Button type="submit" colorScheme="pink" isLoading={isSubmitting}>
                Entrar
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
}