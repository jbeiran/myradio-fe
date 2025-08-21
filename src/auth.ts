import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const username = String(credentials.username ?? "");
        const password = String(credentials.password ?? "");
        if (
          username === process.env.AUTH_USER &&
          password === process.env.AUTH_PASS
        ) {
          return {
            id: "user",
            name: username,
            email: `${username}@local`,
            role: "admin" as const,
          };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role =
          (user as any).role ??
          (token.name === process.env.AUTH_USER ? "admin" : "user");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role ?? "user";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
