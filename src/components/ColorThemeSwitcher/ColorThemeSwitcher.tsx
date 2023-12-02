'use client';

import {
    IconMoonStars,
    IconSunHigh,
    IconDeviceDesktop,
    IconCheck,
    IconSettings
} from '@tabler/icons-react';
import {
    ActionIcon,
    ActionIconProps,
    Button,
    Menu,
    Tooltip,
    useMantineColorScheme
} from '@mantine/core';

export default function ColorThemeSwitcher(props: ActionIconProps) {
    const { setColorScheme, colorScheme } = useMantineColorScheme();

    return (
        <Menu shadow='sm' width={200} position='bottom-end'>
            <Menu.Target>
                <Tooltip label='Change theme' transitionProps={{ transition: 'scale' }}>
                    <ActionIcon {...props}>
                        <IconSettings size={16} />
                    </ActionIcon>
                </Tooltip>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Choose theme</Menu.Label>
                <Menu.Item
                    leftSection={<IconMoonStars size={14} />}
                    rightSection={colorScheme === 'dark' && <IconCheck size={14} />}
                    onClick={() => setColorScheme('dark')}
                >
                    Dark
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconSunHigh size={14} />}
                    rightSection={colorScheme === 'light' && <IconCheck size={14} />}
                    onClick={() => setColorScheme('light')}
                >
                    Light
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconDeviceDesktop size={14} />}
                    rightSection={colorScheme === 'auto' && <IconCheck size={14} />}
                    onClick={() => setColorScheme('auto')}
                >
                    System
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}