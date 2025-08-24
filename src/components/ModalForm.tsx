import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import IconRating from "@/components/IconRating";

type FieldType = "text" | "textarea" | "date" | "number" | "rating";

type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  variant?: "book" | "star";
  rows?: number;
};

type ModalFormProps<T extends Record<string, any>> = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: string;
  initialValues: T;
  fields: FieldConfig[];
  validationSchema?: Yup.AnyObjectSchema;
  submitLabel?: string;
  cancelLabel?: string;
  closeOnSuccess?: boolean;
  onSubmit: (values: T) => Promise<boolean | void> | boolean | void;
};

export default function ModalForm<T extends Record<string, any>>({
  isOpen,
  onClose,
  title = "Editar",
  size = "xl",
  initialValues,
  fields,
  validationSchema,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  closeOnSuccess = true,
  onSubmit,
}: ModalFormProps<T>) {
  const toast = useToast();
  const fieldBg = "white";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await onSubmit(values);
              if (closeOnSuccess && (res === undefined || res === true)) {
                onClose();
              }
            } catch (e: any) {
              toast({
                title: e?.message || "Ocurrió un error",
                status: "error",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors, touched, setFieldValue, values }) => (
            <Form noValidate>
              <ModalBody>
                <VStack align="stretch" spacing={4}>
                  {fields.map((f) => {
                    if (f.type === "rating") {
                      const err = (errors as any)[f.name];
                      const tch = (touched as any)[f.name];
                      return (
                        <FormControl key={f.name} isInvalid={!!err && !!tch}>
                          <FormLabel>{f.label}</FormLabel>
                          <IconRating
                            variant={f.variant || "star"}
                            value={Number((values as any)[f.name] ?? 0)}
                            onChange={(n: number) => setFieldValue(f.name, n)}
                          />
                          <FormErrorMessage>{err as any}</FormErrorMessage>
                        </FormControl>
                      );
                    }

                    if (f.type === "textarea") {
                      return (
                        <Field name={f.name} key={f.name}>
                          {({ field }: any) => (
                            <FormControl
                              isInvalid={
                                !!(errors as any)[f.name] &&
                                !!(touched as any)[f.name]
                              }
                            >
                              <FormLabel htmlFor={f.name}>{f.label}</FormLabel>
                              <Textarea
                                id={f.name}
                                rows={f.rows || 8}
                                placeholder={f.placeholder}
                                {...field}
                                bg={fieldBg}
                              />
                              <FormErrorMessage>
                                {(errors as any)[f.name]}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      );
                    }

                    return (
                      <Field name={f.name} key={f.name}>
                        {({ field }: any) => (
                          <FormControl
                            isInvalid={
                              !!(errors as any)[f.name] &&
                              !!(touched as any)[f.name]
                            }
                          >
                            <FormLabel htmlFor={f.name}>{f.label}</FormLabel>
                            <Input
                              id={f.name}
                              type={f.type === "text" ? "text" : f.type}
                              placeholder={f.placeholder}
                              {...field}
                              bg={fieldBg}
                            />
                            <FormErrorMessage>
                              {(errors as any)[f.name]}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    );
                  })}
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button mr={3} onClick={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  colorScheme="pink"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {submitLabel}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
