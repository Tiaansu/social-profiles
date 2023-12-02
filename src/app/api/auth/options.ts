import prisma from '@/prisma/client';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        jwt(params) {
            return params.token;
        },
        async session({ session }) {
            if (session.user?.email) {
                const sessionUser = await prisma.users.findUnique({ where: { email: session.user.email } });

                session.user.id = sessionUser?.id.toString();
            }

            return session;
        },
        async signIn({ profile }) {
            try {
                if (profile?.email) {
                    const userExists = await prisma.users.findUnique({ where: { email: profile.email } });
    
                    if (!userExists) {
                        await prisma.users.create({
                            data: {
                                email: profile.email,
                                username: profile.name ?? 'No name',
                                image: profile.picture
                            }
                        });
                    }
                }
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    }
};