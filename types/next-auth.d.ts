// types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    account_id: number;
    session_id: string;
  }

  interface Session extends DefaultSession {
    user?: {
      account_id: number;
      session_id: string;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    account_id: number;
    session_id: string;
  }
}