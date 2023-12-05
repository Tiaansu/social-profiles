import prisma from '@/prisma/client';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const { userId } = params;

    // Checking if the userId is less than 0
    if (!ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    try {
        const user = await prisma.users.findUnique({ 
            where: {
                id: userId
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const socialProfiles = await prisma.socialProfiles.findMany({
            where: {
                userId
            }
        });

        if (!socialProfiles) {
            return NextResponse.json({ message: 'The user does not have social profiles shared yet' }, { status: 404 });
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

        return NextResponse.json({ 
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                image: user.image
            }, 
            socialProfiles: socialProfilesMap 
        }, { 
            status: 200 
        });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};