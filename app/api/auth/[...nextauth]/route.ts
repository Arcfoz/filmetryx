import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";

interface TMDBUser extends User {
  account_id: number;
  session_id: string;
}

async function tmdbAuth(requestToken: string): Promise<TMDBUser> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/authentication/session/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_token: requestToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.status_message || "Failed to create session");
    }

    // Get account details
    const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_TMDB_URL}/account?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&session_id=${data.session_id}`);
    const accountData = await accountResponse.json();

    if (!accountData.id) {
      throw new Error("Failed to fetch account details");
    }

    return {
      id: accountData.id.toString(),
      name: accountData.username,
      email: accountData.email,
      image: null,
      account_id: accountData.id,
      session_id: data.session_id,
    };
  } catch (error) {
    console.error("TMDB Auth Error:", error);
    throw error;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "tmdb",
      name: "TMDB",
      credentials: {
        requestToken: { type: "text" },
      },
      async authorize(credentials): Promise<TMDBUser | null> {
        if (!credentials?.requestToken) {
          throw new Error("No request token provided");
        }

        try {
          return await tmdbAuth(credentials.requestToken);
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.account_id = user.account_id;
        token.session_id = user.session_id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.account_id = token.account_id;
        session.user.session_id = token.session_id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 1 * 60 * 60,
  },
});

export { handler as GET, handler as POST };