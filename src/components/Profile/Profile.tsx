'use client';

import { Avatar, Group, ScrollArea, Text } from '@mantine/core';
import { Session } from 'next-auth'
import SocialProfiles, { SocialProfileSkeleton } from './SocialProfiles';
import { useEffect, useState } from 'react';
import AddSocialProfileButton from './AddSocialProfileButton';

interface ProfileProps {
    session: Session;
}

export default function Profile({ session }: ProfileProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchSocialProfiles = async () => {
            try {
                const res = await fetch(`/api/social-profiles/${session.user.id}`);

                if (!res.ok) {
                    return setErrorMessage((await res.json()).message);
                }

                setSocialProfiles(await res.json());
            } catch (error) {
                setErrorMessage('Something went wrong');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSocialProfiles();
    }, []);

    return (
        <>
            <Group
                justify='space-between'
                mb='lg'
            >
                <Group>
                    <Avatar src={session.user.image} alt='Your profile picture' radius='xl' />
                    <Text>Hello, <Text span c='green'>{session.user.name}</Text></Text>
                </Group>
                <AddSocialProfileButton session={session} setSocialProfiles={setSocialProfiles} />
            </Group>
            {errorMessage ? (
                <></>
            ) : (
                <>
                    {isLoading ? (
                        <SocialProfileSkeleton />
                    ) : (
                        <ScrollArea h={600}>
                            <SocialProfiles session={session} socialProfiles={socialProfiles} setSocialProfiles={setSocialProfiles} />
                        </ScrollArea>
                    )}
                </>
            )}
        </>
    );
}