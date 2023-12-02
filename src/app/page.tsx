import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/options';
import Profile from '@/components/Profile/Profile';
import ProfileNoSession from '@/components/Profile/ProfileNoSession';

export default async function Home() {
    const session = await getServerSession(authOptions);

    return (
        <main>
            {session ? (
                <Profile session={session} />
            ) : (
                <ProfileNoSession />
            )}
        </main>
    )
}
