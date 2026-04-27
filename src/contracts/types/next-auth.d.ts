import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession, Profile as NextAuthProfile } from 'next-auth';

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

  interface Profile extends NextAuthProfile {
    login?: string;
    avatar_url?: string;
    html_url?: string;
    id?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    uid?: number;
    access_status?: string;
    role?: string;
  }
}
