'use client';

import { Button, Flex, Text } from '@mantine/core';
import { signIn } from 'next-auth/react';

export default function ProfileNoSession() {
    return (
        <Flex
            direction='column'
            gap={18}
            align='center'
            justify='center'
        >
            <Text ta='center'>Hello, want to share your social profiles? Click the button below to get started.</Text>
            <Button
                variant='light'
                color='green'
                size='lg'
                radius='xl'
                onClick={() => signIn('google')}
            >
                Share your social profiles
            </Button>
        </Flex>
    )
}