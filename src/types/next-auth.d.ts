import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    uid?: number;
    access_status?: string;
    role?: string;
  }

  interface Session {
    user: {
      uid?: number;
      access_status?: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: number;
    access_status?: string;
    role?: string;
  }
}
