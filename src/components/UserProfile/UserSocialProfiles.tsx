'use client';

import { 
    Anchor,
    Card,
    Flex,
    Group,
    SimpleGrid, 
    Stack, 
    Text, 
    ThemeIcon
} from '@mantine/core';
import validUrl from 'valid-url';
import emailValidator from 'email-validator';
import { getSocialProfileBrandIcon } from '../Profile/SocialProfiles';

interface UserSocialProfilesProps {
    socialProfiles: SocialProfile[];
}

interface UserSocialProfileCard {
    socialProfile: SocialProfile;
}

function UserSocialProfileCard({ socialProfile }: UserSocialProfileCard) {
    return socialProfile.url && validUrl.isUri(socialProfile.url) ? (
        <Anchor
            href={`${emailValidator.validate(socialProfile.url) ? 'mailto:' : ''}${socialProfile.url}`}
            target='_blank'
            truncate='end'
            underline='never'
        >
            <Card
                shadow='md'
                radius='md'
            >
                <Group justify='space-between'>
                    <Flex
                        gap={12}
                    >
                        <ThemeIcon size='lg' variant='light' color={socialProfile.color ?? 'green'} my='auto'>
                            {getSocialProfileBrandIcon((socialProfile.platform))}
                        </ThemeIcon>

                        <Stack gap={1} w={{ base: 50, sm: 100, md: 150, lg: 250 }}>
                            <Text truncate='end'>{socialProfile.label}</Text>
                            <Text
                                size='sm'
                                c={socialProfile.color ?? 'green'}
                                truncate='end'
                            >
                                {emailValidator.validate(socialProfile.url) ? 'mailto:' : ''}{socialProfile.url}
                            </Text>
                        </Stack>
                    </Flex>
                </Group>
            </Card>
        </Anchor>
    ) : (
        <></>
    )
}

export default function UserSocialProfiles({ socialProfiles }: UserSocialProfilesProps) {
    return !socialProfiles.length ? (
        <Text>No social profiles found.</Text>
    ) : (
        <SimpleGrid
            cols={{ base: 1, xs: 2, lg: 3 }}
            spacing={{ base: 10, sm: 'lg' }}
            verticalSpacing={{ base: 'sm', sm: 'lg' }}
        >
            {socialProfiles.map((socialProfile) => (
                <UserSocialProfileCard key={socialProfile.id} socialProfile={socialProfile} />
            ))}
        </SimpleGrid>
    );
}