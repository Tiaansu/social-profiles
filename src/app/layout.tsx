import '@/styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import type { Metadata } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import MainLayout from '@/components/MainLayout/MainLayout';
import { ModalsProvider } from '@mantine/modals';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import { Notifications } from '@mantine/notifications';

export const metadata: Metadata = {
    title: 'Social Profiles',
    description: 'Connect with the world seamlessly.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <html lang='en'>
                <head>
                    <ColorSchemeScript />
                </head>
                <body>
                    <MantineProvider defaultColorScheme='dark'>
                        <ModalsProvider>
                            <Notifications />
                            <MainLayout>
                                {children}
                            </MainLayout>
                        </ModalsProvider>
                    </MantineProvider>
                </body>
            </html>
        </AuthProvider>
    )
}
