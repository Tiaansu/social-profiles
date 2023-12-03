'use client';

import { Anchor, Button, Group, Text } from '@mantine/core';
import { IconShare3 } from '@tabler/icons-react';
import { Session } from 'next-auth';
import { useState } from 'react';

interface ShareSocialProfilesProps {
    session: Session;
    disabled: boolean;
}

export default function ShareSocialProfiles({ session, disabled }: ShareSocialProfilesProps) {
    const [readmeCopied, setReadmeCopied] = useState<boolean>(false);
    const [bioCopied, setBioCopied] = useState<boolean>(false);

    const copyForReadme = () => {
        navigator.clipboard.writeText(`
            [![Social Profile](${process.env.NEXT_PUBLIC_BASE_URL}/api/social-profiles/${session.user.id}/github)](${process.env.NEXT_PUBLIC_BASE_URL})
        `);
        setReadmeCopied(true);

        setTimeout(() => setReadmeCopied(false), 1500);
    };

    const copyForBio = () => {
        navigator.clipboard.writeText(`
            ${process.env.NEXT_PUBLIC_BASE_URL}/${session.user.id}
        `);
        setBioCopied(true);

        setTimeout(() => setBioCopied(false), 1500);
    };

    return (
        <Group>
            <Group>
                <Text>
                    For the card options, go <Anchor href='https://github.com/Tiaansu/social-profiles#options' target='_blank' c='green'>here</Anchor>
                </Text>
                <Button
                    variant='light'
                    color='green'
                    rightSection={!readmeCopied && <IconShare3 size={18} />}
                    onClick={copyForReadme}
                    disabled={disabled}
                >
                    {readmeCopied ? 'Copied' : 'For README'}
                </Button>
            </Group>
            <Button
                variant='light'
                color='green'
                rightSection={!bioCopied && <IconShare3 size={18} />}
                onClick={copyForBio}
                disabled={disabled}
            >
                {bioCopied ? 'Copied' : 'For BIO'}
            </Button>
        </Group>
    )
}