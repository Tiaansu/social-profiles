import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const { 
            platform, 
            label, 
            url,
            color,
            userId
        }: any = await req.json();

        // Checking if the payload satiesfies
        // the needed parameters
        if (!platform || !label || !color) {
            return NextResponse.json({ message: 'Missing platform, label, or color.' }, { status: 400 });
        }

        await prisma.socialProfiles.create({
            data: {
                platform,
                label,
                url,
                color,
                userId
            }
        });

        const updatedData = await prisma.socialProfiles.findMany({ where: { userId } });

        return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Something went wrong'}, { status: 500 });
    }
}; 