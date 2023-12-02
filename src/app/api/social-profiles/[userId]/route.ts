import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const { userId } = params;

    // Checking if the userId is less than 0
    if (parseInt(userId) <= 0) {
        return NextResponse.json([], { status: 400 });
    }

    try {
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