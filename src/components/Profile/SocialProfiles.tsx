'use client';

import { 
    ActionIcon,
    Alert,
    Anchor,
    Button,
    Card, 
    ColorPicker, 
    Flex, 
    Group, 
    Modal, 
    Select, 
    SimpleGrid, 
    Skeleton, 
    Stack, 
    Text, 
    TextInput, 
    ThemeIcon 
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { 
    IconAlertCircle,
    IconBrandBitbucket,
    IconBrandDiscord,
    IconBrandFacebook, 
    IconBrandGithub, 
    IconBrandGitlab, 
    IconBrandInstagram, 
    IconBrandReddit, 
    IconBrandSlack, 
    IconBrandTiktok, 
    IconCheck, 
    IconError404, 
    IconMail,
    IconPencil,
    IconTrash
} from '@tabler/icons-react';
import { Session } from 'next-auth';
import { SetStateAction, useState } from 'react';
import validUrl from 'valid-url';
import * as emailValidator from 'email-validator';
import { useDisclosure } from '@mantine/hooks';
import { hasLength, useForm } from '@mantine/form';
import { colorSwatches, platformOptions } from './AddSocialProfileButton';

interface SocialProfilesProps {
    session: Session;
    socialProfiles: SocialProfile[];
    setSocialProfiles: (value: SetStateAction<SocialProfile[]>) => void;
}

interface SocialProfileProps {
    session: Session;
    socialProfile: SocialProfile;
    setSocialProfiles: (value: SetStateAction<SocialProfile[]>) => void;
}

function getSocialProfileBrandIcon(brand: string): React.JSX.Element {
    switch (brand) {
        case 'facebook': return <IconBrandFacebook size={24} />;
        case 'instagram': return <IconBrandInstagram size={24} />;
        case 'reddit': return <IconBrandReddit size={24} />;
        case 'github': return <IconBrandGithub size={24} />;
        case 'gitlab': return <IconBrandGitlab size={24} />;
        case 'bitbucket': return <IconBrandBitbucket size={24} />;
        case 'discord': return <IconBrandDiscord size={24} />;
        case 'slack': return <IconBrandSlack size={24} />;
        case 'tiktok': return <IconBrandTiktok size={24} />;
        case 'email': return <IconMail size={24} />;
        default: return <IconError404 size={24} />
    }
}

export function SocialProfileSkeleton() {
    return (
        <SimpleGrid
            cols={{ base: 1, xs: 2, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'lg' }}
        >
            {[...Array(8).keys()].map((i) => (
                <Skeleton 
                    visible 
                    key={i}
                >
                    <Card shadow='md' padding='sm' radius='md'>
                        <Flex
                            gap={12}
                        >
                            <ThemeIcon size='lg' variant='light' color='green' my='auto'>
                                <IconError404 size={24} />
                            </ThemeIcon>

                            <Stack gap={1}>
                                <Text>john.doe@my-url.com</Text>
                                <Text size='sm'>john.doe@my-url.com</Text>
                            </Stack>
                        </Flex>
                    </Card>
                </Skeleton>
            ))}
        </SimpleGrid>
    )
}

function SocialProfileCard({ session, socialProfile, setSocialProfiles }: SocialProfileProps) {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [defaultValue, setDefaultValue] = useState<SocialProfile>({
        platform: '',
        id: '0',
        label: '',
        color: 'green',
        url: ''
    });

    const [isOpen, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            platform: '',
            label: '',
            color: 'green',
            url: ''
        },
        validate: {
            platform: hasLength({ min: 1 }, 'Platform must be at least 1 character long.'),
            label: hasLength({ min: 1, max: 64 }, 'Label must be 1-64 characters long.'),
        }
    });

    const openDeleteModal = (id: string, label: string, userId: string) => modals.openConfirmModal({
        title: 'Delete social profile',
        centered: true,
        children: (
            <Text size='sm'>
                Are you sure you want to delete {label}? This action is <Text span c='red' fw={500}>irreversible</Text>.
            </Text>
        ),
        labels: { confirm: 'Delete social profile', cancel: 'Cancel' },
        confirmProps: { variant: 'light', color: 'red' },
        cancelProps: { variant: 'light', color: 'gray' },

        onConfirm: async () => {
            const notificationId = notifications.show({
                loading: true,
                message: `Deleting ${label}...`,
                autoClose: false,
                withCloseButton: false
            });

            try {
                const res = await fetch(`/api/social-profiles/${userId}/profile/${id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    return notifications.update({
                        id: notificationId,
                        color: 'red',
                        message: `Failed to delete ${label}. ${await res.text()}`,
                        icon: <IconAlertCircle size={18} />,
                        loading: false,
                        autoClose: 3500,
                        withCloseButton: true
                    });
                }

                setSocialProfiles(await res.json());
            } catch (error) {
                return notifications.update({
                    id: notificationId,
                    color: 'red',
                    message: 'Something went wrong',
                    icon: <IconAlertCircle size={18} />,
                    loading: false,
                    autoClose: 3500,
                    withCloseButton: true
                });
            } finally {
                notifications.update({
                    id: notificationId,
                    color: 'green',
                    message: `Successfully deleted ${label}`,
                    icon: <IconCheck size={18} />,
                    loading: false,
                    autoClose: true,
                    withCloseButton: true
                });
            }
        }
    });

    const handleSubmit = async () => {
        setIsUpdating(true);

        try {
            const { platform, label, url, color } = form.values;
            const res = await fetch(`/api/social-profiles/${session.user.id}/profile/${defaultValue.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    platform,
                    label,
                    url,
                    color
                })
            });

            if (!res.ok) {
                return setErrorMessage((await res.json()).message);
            }

            setSocialProfiles(await res.json());

            close();
            notifications.show({
                message: 'Successfully updated social profile',
                icon: <IconCheck size={18} />,
                color: 'green',
                autoClose: true,
                withCloseButton: true
            });
        } catch (error) {
            setErrorMessage('Something went wrong');
        } finally {
            setTimeout(() => {
                setErrorMessage('');
            }, 2500);
            setIsUpdating(false);
        }
    };

    return (
        <Card 
            shadow='md'
            radius='md'
        >
            <Group justify='space-between'>
                <Flex
                    gap={12}
                >
                    <ThemeIcon size='lg' variant='light' color={socialProfile.color ?? 'green'} my='auto'>
                        {getSocialProfileBrandIcon(socialProfile.platform)}
                    </ThemeIcon>

                    <Stack gap={1} w={{ base: 100, sm: 150, md: 200, lg: 300 }}>
                        <Text truncate='end'>{socialProfile.label}</Text>
                        {/* Checking if the socialProfile.url is actually an url otherwise it will only be a simple <p> tag. */}
                        {socialProfile.url && validUrl.isUri(socialProfile.url) ? (
                            <Anchor
                                size='sm'
                                underline='hover'
                                c={socialProfile.color ?? 'green'}
                                target='_blank'
                                href={socialProfile.url}
                                truncate='end'
                            >
                                {emailValidator.validate(socialProfile.url) ? 'mailto:' : ''}{socialProfile.url}
                            </Anchor>
                        ) : (
                            <Text
                                size='sm'
                                c={socialProfile.color ?? 'green'}
                                truncate='end'
                            >
                                {socialProfile.url}
                            </Text>
                        )}
                    </Stack>
                </Flex>

                {/* Edit */}
                <Modal opened={isOpen} onClose={close} title='Edit social profile' centered>
                    {errorMessage && (
                        <Alert variant='light' color='red' radius='md' title='Error' icon={<IconAlertCircle size={18} />}>
                            {errorMessage}
                        </Alert>
                    )}
                    <form onSubmit={form.onSubmit(() => handleSubmit())}>
                        <Select
                            label='Platform'
                            placeholder='Pick platform'
                            data={platformOptions}
                            withAsterisk
                            {...form.getInputProps('platform')}
                        />
                        <TextInput
                            label='Label'
                            placeholder='Enter a label'
                            withAsterisk
                            {...form.getInputProps('label')}
                        />
                        <TextInput
                            label='URL'
                            placeholder='Enter a URL'
                            withAsterisk
                            {...form.getInputProps('url')}
                        />
                        <ColorPicker 
                            mt='md'
                            format='rgb'
                            swatches={colorSwatches}
                            fullWidth
                            {...form.getInputProps('color')}
                        />
                        
                        <Button
                            mt='md'
                            type='submit'
                            variant='light'
                            color='green'
                            fullWidth
                            loading={isUpdating}
                            disabled={
                                form.values.platform === defaultValue.platform &&
                                form.values.label === defaultValue.label &&
                                form.values.url === defaultValue.url &&
                                form.values.color === defaultValue.color
                            }
                        >
                            {!isUpdating && 'Add'}
                        </Button>
                    </form>
                </Modal>

                <Group>
                    <ActionIcon.Group>
                        <ActionIcon 
                            variant='light' 
                            size='lg' 
                            color='yellow'
                            onClick={() => {
                                form.setValues({
                                    platform: socialProfile.platform,
                                    label: socialProfile.label,
                                    url: socialProfile.url,
                                    color: socialProfile.color
                                });
                                setDefaultValue({
                                    platform: socialProfile.platform,
                                    label: socialProfile.label,
                                    url: socialProfile.url,
                                    color: socialProfile.color,
                                    id: socialProfile.id
                                });
                                open();
                            }}
                        >
                            <IconPencil size={18} />
                        </ActionIcon>

                        <ActionIcon 
                            variant='light' 
                            size='lg' 
                            color='red'
                            onClick={() => {
                                openDeleteModal(socialProfile.id, socialProfile.label, session.user.id ?? '0');
                            }}
                        >
                            <IconTrash size={18} />
                        </ActionIcon>
                    </ActionIcon.Group>
                </Group>
            </Group>
        </Card>
    )
}

export default function SocialProfiles({ session, socialProfiles, setSocialProfiles }: SocialProfilesProps) {
    return !socialProfiles.length ? (
        <Text>No social profiles found, add one first.</Text>
    ) : (
        <SimpleGrid 
            cols={{ base: 1, xs: 2, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'lg' }}
        >
            {socialProfiles.map((socialProfile) => (
                <SocialProfileCard key={socialProfile.id} session={session} socialProfile={socialProfile} setSocialProfiles={setSocialProfiles} />
            ))}
        </SimpleGrid>
    );
}