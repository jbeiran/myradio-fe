import * as Yup from "yup";

export const BookSchema = Yup.object({
  title: Yup.string().required("Título requerido").max(160),
  author: Yup.string().required("Autor requerido").max(120),
  rating: Yup.number().min(1).max(5).required("Rating requerido"),
  review: Yup.string().required("Reseña requerida").min(10),
  date: Yup.string().nullable(),
  gender: Yup.string(),
});

export const MovieSchema = Yup.object({
  title: Yup.string().required("Título requerido").max(160),
  director: Yup.string().max(120),
  rating: Yup.number().min(1).max(5).required("Rating requerido"),
  review: Yup.string().required("Reseña requerida").min(10),
  gender: Yup.string(),
  date: Yup.string().nullable(),
});

export const DiarySchema = Yup.object({
  title: Yup.string().required("Título requerido").max(120),
  content: Yup.string().required("Contenido requerido").min(20),
  tags: Yup.string().max(200),
  date: Yup.string().nullable(),
});
