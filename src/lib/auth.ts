import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { google } from "googleapis";
import {
  Account,
  getServerSession as originalGetServerSession,
  Session,
  type AuthOptions,
  type User as NextAuthUser,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

async function refreshAccessToken(token: JWT) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    oauth2Client.setCredentials({
      refresh_token: token.refreshToken as string,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    return {
      ...token,
      accessToken: credentials.access_token,
      accessTokenExpires: credentials.expiry_date,
      refreshToken: credentials.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar.events",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const lowerCaseEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: lowerCaseEmail },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback - user:", user);
      if (account?.type === "oauth" && user.email) {
        const existingDbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingDbUser) {
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            // If no account exists for this provider, link it to the existing user
            await prisma.account.create({
              data: {
                userId: existingDbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                id_token: account.id_token,
                refresh_token: account.refresh_token,
                scope: account.scope,
                session_state: account.session_state,
                token_type: account.token_type,
              },
            });

            // Update emailVerified for the existing user
            await prisma.user.update({
              where: { id: existingDbUser.id },
              data: { emailVerified: new Date() },
            });
          }
        }
      }
      return true;
    },
    async jwt({
      token,
      user,
      account,
      trigger,
      session,
    }: {
      token: JWT;
      user?: NextAuthUser | AdapterUser;
      account?: Account | null;
      session?: any;
      trigger?: "signIn" | "signUp" | "update" | "jwt";
    }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
      }

      // Return previous token if the access token has not expired yet
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number) * 1000
      ) {
        return token;
      }

      // If the access token has expired and we have a refresh token, try to refresh it
      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

      // For credentials provider, or if we don't have a refresh token, just return the token
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.accessToken = token.accessToken; // Add access token to session
        session.refreshToken = token.refreshToken; // Add refresh token to session
        session.accessTokenExpires = token.accessTokenExpires; // Add expiry to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async linkAccount({ user, account, profile }) {
      console.log("linkAccount event triggered!");
      if (user.email) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() },
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession: () => Promise<Session | null> = () =>
  originalGetServerSession(authOptions);
