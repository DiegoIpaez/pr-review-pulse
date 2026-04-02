import GitHub from 'next-auth/providers/github';
import NextAuth from 'next-auth';
import { CONFIG } from '@/constants/config.constant';
import { upsertGitHubUser } from '../../users/user.service';

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
    async signIn({ profile, user: authUser }) {
      if (!profile) return false;

      const user = await upsertGitHubUser({
        login: profile.login as string,
        avatar_url: profile.avatar_url as string | undefined,
        html_url: profile.html_url as string | undefined,
      });

      authUser.uid = user.id;
      authUser.access_status = user.access_status;
      authUser.role = user.role;
      return true;
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      const user = { ...session?.user, ...token };
      return { ...session, user };
    },
    authorized: async ({ auth: session }) => {
      return !!session;
    },
  },
});

export const { GET, POST } = handlers;
