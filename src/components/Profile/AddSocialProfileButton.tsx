'use client';

import { 
    Box, 
    Button, 
    ColorPicker, 
    ComboboxData, 
    Modal, 
    Select, 
    TextInput 
} from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { Session } from 'next-auth';
import { SetStateAction, useState } from 'react';

interface AddSocialProfileButtonProps {
    session: Session;
    setSocialProfiles: (value: SetStateAction<SocialProfile[]>) => void;
}

export const platformOptions: ComboboxData = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Reddit', value: 'reddit' },
    { label: 'GitHub', value: 'github' },
    { label: 'GitLab', value: 'gitlab' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Linktree', value: 'linktree' },
    { label: 'Threads', value: 'threads' },
    { label: 'Twitch', value: 'twitch' },
    { label: 'BitBucket', value: 'bitbucket' },
    { label: 'Discord', value: 'discord' },
    { label: 'Slack', value: 'slack' },
    { label: 'Tiktok', value: 'tiktok' },
    { label: 'Email', value: 'email' },
    { label: 'X (Twitter)', value: 'x' }
];

export const colorSwatches: string[] = ['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14'];

export default function AddSocialProfileButton({ session, setSocialProfiles }: AddSocialProfileButtonProps) {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const form = useForm({
        initialValues: {
            platform: 'facebook',
            label: '',
            url: '',
            color: 'green'
        },

        validate: {
            platform: hasLength({ min: 1 }, 'Platform must be at least 1 character long.'),
            label: hasLength({ min: 1, max: 64 }, 'Label must be 1-64 characters long.'),
        }
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const { platform, color, label, url} = form.values;
            const res = await fetch('/api/social-profiles', {
                method: 'POST',
                body: JSON.stringify({
                    platform,
                    label, 
                    url,
                    color,
                    userId: session.user.id
                })
            });

            if (!res.ok) {
                console.log(await res.json());
                return;
            }

            setSocialProfiles(await res.json());
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
            form.reset();
            close();
        }
    };

    return (
        <>
            <Modal opened={isOpen} onClose={close} title='Add social profile' centered>
                <Box component='form' onSubmit={form.onSubmit(() => handleSubmit())}>
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
                        loading={isSubmitting}
                    >
                        {!isSubmitting && 'Add'}
                    </Button>
                </Box>
            </Modal>

            <Button 
                rightSection={<IconPlus size={18} />} 
                variant='light' 
                color='green'
                onClick={open}
            >
                Add social profile
            </Button>
        </>
    )
}