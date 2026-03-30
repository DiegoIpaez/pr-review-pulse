import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { CONFIG } from '@/constants/config.constant';

const { handlers } = NextAuth({
  providers: [
    GitHub({
      clientId: CONFIG.GITHUB_CLIENT_ID,
      clientSecret: CONFIG.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: CONFIG.NEXT_AUTH.SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: async ({ auth: session }) => {
      return !!session;
    },
  },
});

export const { GET, POST } = handlers;
