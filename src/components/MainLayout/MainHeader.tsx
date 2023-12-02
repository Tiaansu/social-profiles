import { 
    Avatar, 
    Button, 
    Group} from '@mantine/core';
import ColorThemeSwitcher from '../ColorThemeSwitcher/ColorThemeSwitcher';
import { IconLogin, IconLogout } from '@tabler/icons-react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';

interface MainHeaderProps {
    session: Session | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
};

export default function MainHeader({ session, status }: MainHeaderProps) {
    return (
        <>
            <Group h='100%' px='md' visibleFrom='md' justify='space-between'>
                <Avatar 
                    src='/assets/images/logo.png'
                    alt='Social Profiles logo'
                    component='a'
                    href='/'
                />

                <Group gap={8}>
                    <ColorThemeSwitcher size='lg' radius='xl' variant='light' color='green' />
                    {status === 'loading' ? (
                        <Button
                            variant='light'
                            color='gray'
                            size='sm'
                            radius='xl'
                            disabled
                        >Authenticating</Button>
                    ) : (
                        <>
                            {status === 'unauthenticated' || !session ? (
                                <Button 
                                    variant='light' 
                                    color='green' 
                                    size='sm' 
                                    radius='xl' 
                                    rightSection={<IconLogin size={18} />}
                                    onClick={() => signIn('google')}
                                >
                                    Login
                                </Button>
                            ) : (
                                <Button 
                                    variant='light'
                                    color='green' 
                                    size='sm' 
                                    radius='xl' 
                                    rightSection={<IconLogout size={18} />}
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </Button>
                            )}
                        </>
                    )}
                </Group>
            </Group>

            <Group h='100%' px='md' hiddenFrom='md' justify='space-between'>
                <Avatar 
                    src='/assets/images/logo.png'
                    alt='Social Profiles logo'
                    component='a'
                    href='/'
                />
                
                <Group gap={8}>
                    <ColorThemeSwitcher size='md' radius='md' variant='light' color='green' />
                    {status === 'loading' ? (
                        <Button
                            variant='light'
                            color='gray'
                            size='sm'
                            radius='xl'
                            loading
                        />
                    ) : (
                        <>
                            {status === 'unauthenticated' || !session ? (
                                <Button 
                                    variant='light' 
                                    color='green' 
                                    size='sm' 
                                    radius='xl' 
                                    rightSection={<IconLogin size={18} />}
                                    onClick={() => signIn('google')}
                                >
                                    Login
                                </Button>
                            ) : (
                                <Button 
                                    variant='light'
                                    color='green' 
                                    size='sm' 
                                    radius='xl' 
                                    rightSection={<IconLogout size={18} />}
                                    onClick={() => signOut()}
                                >
                                    Logout
                                </Button>
                            )}
                        </>
                    )}
                </Group>
            </Group>
        </>
    )
}
