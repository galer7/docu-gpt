import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type TokenSet,
  type Session,
  type User,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type { AdapterUser } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // session.user.role = user.role; <-- put other properties on the session here
      }

      return handleTokenRefresh({ user, session });
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

async function handleTokenRefresh({
  user,
  session,
}: {
  user: User | AdapterUser;
  session: Session;
}) {
  const [google] = await prisma.account.findMany({
    where: { userId: user.id, provider: "google" },
  });

  if (!google) {
    throw new Error();
  }

  if (google.expires_at! < Date.now()) {
    // If the access token has expired, try to refresh it
    try {
      // https://accounts.google.com/.well-known/openid-configuration
      // We need the `token_endpoint`.
      const response = await fetch("https://oauth2.googleapis.com/token", {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: google.refresh_token!,
        } as Record<string, string>),
        method: "POST",
      });

      const tokens: TokenSet = await response.json();

      if (!response.ok) throw tokens;

      await prisma.account.update({
        data: {
          access_token: tokens.access_token,
          expires_at: Date.now() + (tokens.expires_in as number) * 1000,
          refresh_token: tokens.refresh_token ?? google.refresh_token,
        },
        where: {
          provider_providerAccountId: {
            provider: "google",
            providerAccountId: google.providerAccountId,
          },
        },
      });
    } catch (error) {
      console.error("Error refreshing access token", error);
      // The error property will be used client-side to handle the refresh token error
      session.error = "RefreshAccessTokenError";
    }
  }

  return session;
}
