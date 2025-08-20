"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data, status } = useSession();
  return {
    user: data?.user ?? null,
    loading: status === "loading",
    authenticated: status === "authenticated",
    login: (username: string, password: string, callbackUrl?: string) =>
      signIn("credentials", {
        username,
        password,
        redirect: false,
        callbackUrl,
      }),
    logout: () => signOut(),
  };
}
