import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });

        console.log("===== USER DARI DATABASE =====");
        console.dir(user, { depth: null });

        if (!user) return null;

        const validPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!validPassword) return null;

        return {
          id: String(user.id),
          name: user.username,
          email: user.email,
          roles: user.userRoles.map((r) => r.role.name),
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
        if (user) {
        token.id = user.id;
        token.roles = user.roles;
        }

        return token;
    },

    async session({ session, token }) {
        if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[];
        }

        return session;
    },
    },
});