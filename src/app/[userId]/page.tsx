import UserProfile from '@/components/UserProfile/UserProfile';
import { Users } from '@prisma/client';
import { ObjectId } from 'mongodb';
import { Metadata } from 'next'
import { notFound } from 'next/navigation';

interface Props {
    params: { userId: string };
}

async function getUserAndSocialProfiles({ params }: Props): Promise<{
    user: Users | null;
    socialProfiles: SocialProfile[]
}> {
    const { userId } = params;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social-profiles/${userId}`);

    if (!response.ok) {
        return {
            user: null,
            socialProfiles: []
        };
    }

    const { user, socialProfiles }: {
        user: Users;
        socialProfiles: SocialProfile[];
    } = await response.json();

    return { user, socialProfiles };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { userId } = params;

    if (!ObjectId.isValid(userId)) {
        return {
            title: 'Page not found - Social Profiles '
        }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/social-profiles/${userId}`);

    if (!response.ok) {
        return {
            title: 'Something went wrong - Social Profiles'
        }
    }

    const { user, socialProfiles }: {
        user: Users;
        socialProfiles: SocialProfile[]
    } = await response.json();

    return {
        title: `${user.username}'s social profiles`
    }
}

export default async function UserPage({ params }: Props) {
    const { user, socialProfiles } = await getUserAndSocialProfiles({ params });

    if (!user) notFound();

    return <UserProfile user={user} socialProfiles={socialProfiles} />
}
