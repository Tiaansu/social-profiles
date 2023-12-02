import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest, { params }: { params: { userId: string; id: string; } }) => {
    const { userId, id } = params;

    // Checking if the userId or id is less than 0
    if (parseInt(userId) <= 0 || parseInt(id) <= 0) {
        return NextResponse.json([], { status: 400 });
    }

    try {
        const { 
            platform, 
            label, 
            url,
            color
        }: any = await req.json();

        if (!platform || !label || !color) {
            return NextResponse.json({ message: 'Missing platform, label, or color.' }, { status: 400 });
        }

        await prisma.socialProfiles.update({
            where: {
                id,
                AND: [
                    {
                        userId
                    }
                ]
            },
            data: {
                platform,
                label,
                color,
                url
            }
        });

        const socialProfiles = await prisma.socialProfiles.findMany({
            where: {
                userId
            }
        });

        if (!socialProfiles) {
            return NextResponse.json([]);
        }

        const socialProfilesMap = socialProfiles.map((socialProfile) => {
            return {
                platform: socialProfile.platform,
                label: socialProfile.label,
                url: socialProfile.url,
                color: socialProfile.color,
                id: socialProfile.id
            };
        });

        return NextResponse.json(socialProfilesMap, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { userId: string; id: string; } }) => {
    const { userId, id } = params;

    // Checking if the userId or id is less than 0
    if (parseInt(userId) <= 0 || parseInt(id) <= 0) {
        return NextResponse.json([], { status: 400 });
    }

    try {
        await prisma.socialProfiles.delete({
            where: {
                id,
                AND: [
                    {
                        userId
                    }
                ]
            }
        });

        const socialProfiles = await prisma.socialProfiles.findMany({
            where: {
                userId
            }
        });

        const socialProfilesMap = socialProfiles.map((socialProfile) => {
            return {
                platform: socialProfile.platform,
                label: socialProfile.label,
                url: socialProfile.url,
                color: socialProfile.color,
                id: socialProfile.id
            }
        });

        return NextResponse.json(socialProfilesMap, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};