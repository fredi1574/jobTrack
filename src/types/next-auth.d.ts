import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string | null;
    refreshToken?: string;
    accessTokenExpires?: number | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string | null;
    refreshToken?: string;
    accessTokenExpires?: number | null;
  }
}
