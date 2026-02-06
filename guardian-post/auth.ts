import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const adminPassword = process.env.ADMIN_PASSWORD;

                // Simple password check
                if (credentials?.password === adminPassword) {
                    // Return a mock user object on success
                    return { id: '1', name: 'Admin', email: 'admin@guardian.post' };
                }

                return null;
            },
        }),
    ],
});
