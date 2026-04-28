import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { CONFIG, NodeEnv } from '@/constants/config.constant';
import { upsertGitHubUser } from '../../users/user.service';

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: CONFIG.GITHUB_CLIENT_ID,
      clientSecret: CONFIG.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: CONFIG.NEXT_AUTH.SECRET,
  debug: CONFIG.NODE_ENV === NodeEnv.Development,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ profile }) {
      if (
        !profile?.login ||
        !profile?.avatar_url ||
        !profile?.html_url ||
        !profile?.id
      ) {
        return false;
      }
      return true;
    },
    async jwt(data) {
      const { token, user, profile } = data;

      if (profile) {
        const ghUser = await upsertGitHubUser({
          id: Number(profile.id),
          login: profile.login as string,
          avatar_url: profile.avatar_url as string,
          html_url: profile.html_url as string,
          email: profile?.email as string | null,
        });

        token.uid = ghUser.id;
        token.access_status = ghUser.access_status;
        token.role = ghUser.role;
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      const user = { ...session?.user, ...token };
      return { ...session, user };
    },
  },
});

export { handler as GET, handler as POST };
