import type { NextAuthConfig, User as AuthUser } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import sql from './db';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'admin' | 'technician' | 'client';
    } & DefaultSession['user'];
  }

  interface User extends AuthUser {
    id: string;
    role: 'admin' | 'technician' | 'client';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'technician' | 'client';
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await sql`
            SELECT id, email, name, password_hash, role 
            FROM users 
            WHERE email = ${credentials.email}
          `;

          if (result.length === 0) {
            return null;
          }

          const user = result[0];
          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password_hash || ''
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'admin' | 'technician' | 'client';
      }
      return session;
    },
  },
  trustHost: true,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
