'use client';

import { AppShell } from '@mantine/core';
import MainHeader from './MainHeader';
import { useSession } from 'next-auth/react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { data: session, status } = useSession();

    return (
        <AppShell
            header={{ height: 75 }}
            padding='md'
        >
            <AppShell.Header>
                <MainHeader session={session} status={status} />
            </AppShell.Header>

            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}