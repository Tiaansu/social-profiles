import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import prisma from '@/prisma/client';
import RenderCard from '@/components/RenderCard/RenderCard';

type Parameters = {
    theme?: string;
    bg?: string;
    borderRadius?: string;
}

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    const { userId } = params;
    
    if (!ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    try {
        const params: Parameters = {};
        req.nextUrl.searchParams.forEach((value: any, key: string) => {
            (params as any)[key] = value;
        });

        const user = await prisma.users.findUnique({ where: { id: userId } });

        if (!user) {
            return NextResponse.json({ message: 'Invalid user.' }, { status: 404 });
        }

        const rawSocialProfiles = await prisma.socialProfiles.findMany({ where: { userId } });

        if (!rawSocialProfiles) {
            return NextResponse.json({ message: 'That user does not have social profiles yet' }, { status: 403 });
        }

        const socialProfiles: SocialProfile[] = rawSocialProfiles.map((socialProfile) => {
            return {
                id: socialProfile.id,
                platform: socialProfile.platform,
                label: socialProfile.label,
                color: socialProfile.color,
                url: socialProfile.url
            }
        });

        const svg = await RenderCard({ body: user, socialProfiles, params });
        
        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'content-security-policy': "default-src 'none'; img-src * data:; style-src 'unsafe-inline'"
            }
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
    }
};