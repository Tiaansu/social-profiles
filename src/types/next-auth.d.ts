import { DefaultSession, Profile } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            sub?: string | null | undefined;
            id?: string;
        } & DefaultSession['user']
    }
    interface Profile extends Profile {
        picture?: string;
    }
}