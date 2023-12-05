import { Avatar, Group, ScrollArea, Text } from '@mantine/core';
import { Users } from '@prisma/client';
import UserSocialProfiles from './UserSocialProfiles';

interface UserProfileProps {
    user: Users;
    socialProfiles: SocialProfile[]
}

export default function UserProfile({ user, socialProfiles }: UserProfileProps) {
    return (
        <>
            <Group
                justify='space-between'
                mb='lg'
            >
                <Group>
                    <Avatar src={user.image} alt={`${user.username}'s profile picture`} radius='xl' />
                    <Text>Welcome to <Text span c='green'>{user.username}</Text>'s profile</Text>
                </Group>
            </Group>

            <ScrollArea h={600}>
                <UserSocialProfiles socialProfiles={socialProfiles} />
            </ScrollArea>
        </>
    );
}