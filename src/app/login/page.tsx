import { Suspense } from "react";
import SignIn from "@/auth/index";

export default function Login() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}