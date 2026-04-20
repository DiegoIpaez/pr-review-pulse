import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { CONFIG } from '@/constants/config.constant';
import { upsertGitHubUser } from '../../users/user.service';

const handler = NextAuth({
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
      if (
        !profile?.login ||
        !profile?.avatar_url ||
        !profile?.html_url ||
        !profile?.id
      ) {
        return false;
      }

      const user = await upsertGitHubUser({
        id: Number(profile.id),
        login: profile.login as string,
        avatar_url: profile.avatar_url as string,
        html_url: profile.html_url as string,
        email: profile?.email as string | null,
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
  },
});

export { handler as GET, handler as POST };
