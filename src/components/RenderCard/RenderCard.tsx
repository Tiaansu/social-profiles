import { encodeBase64 } from '@/lib/toBase64';
import { rgba } from '@mantine/core';
import { Users } from '@prisma/client';
import escape from 'escape-html';

type Parameters = {
    theme?: string;
    bg?: string;
    borderRadius?: string;
}

const parseBool = (string: string | undefined): boolean => string === 'true' ? true : string === '1' ? true : false;

interface RenderCardProps {
    body: Users;
    socialProfiles: SocialProfile[];
    params: Parameters;
}

export default async function RenderCard({ body, socialProfiles, params }: RenderCardProps): Promise<string> {
    let backgroundColor = '1a1c1f',
        theme = 'dark',
        borderRadius = '10px';

    if (params.theme === 'light') {
        backgroundColor = '#eee';
        theme = 'light';
    };
    if (params.bg) backgroundColor = params.bg;
    if (params.borderRadius) borderRadius = params.borderRadius;

    let avatar: string = '';
    if (body.image) {
        avatar = await encodeBase64(body.image);
    }

    const brandIcons: string[] = [];

    for (const socialProfile of socialProfiles) {
        brandIcons.push(await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assets/brand-icons/svg/brand-${socialProfile.platform.replace('email', 'gmail')}.svg`)
        .then((res) => {
            return res.text();
        }).then((text) => {
            return text.replace(/{{ background }}/g, rgba(socialProfile.color, 0.3)).replace(/{{ main }}/g, socialProfile.color);
        }));
    }

    return `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="500px" height="${((Math.round(socialProfiles.length / 2) - 1) * 40) + 200}">
            <foreignObject x="0" y="0" width="500px" height="${((Math.round(socialProfiles.length / 2) - 1) * 40) + 200}">
                <div xmlns="http://www.w3.org/1999/xhtml" style="
                    position: absolute;
                    width: 490px;
                    height: ${((Math.round(socialProfiles.length / 2) - 1) * 40) + 190}px;
                    inset: 0;
                    background-color: #${backgroundColor};
                    color: ${theme === "dark" ? "#fff" : "#000"};
                    font-family: 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    font-size: 16px;
                    display: flex;
                    flex-direction: column;
                    padding: 5px;
                    border-radius: ${borderRadius};
                ">
                    <div style="
                        width: 500px;
                        height: 80px;
                        inset: 0;
                        display: flex;
                        flex-direction: row;
                        padding-bottom: 5px;
                        border-bottom: solid 0.5px ${
                            theme === 'dark' ? 'hsl(0, 0%, 100%, 10%)' : 'hsl(0, 0%, 0%, 10%)'
                        }
                    ">
                        <div style="
                            display: flex;
                            flex-direction: row;
                            height: 80px;
                            width: 80px;
                        ">
                            <img src="${avatar}"
                                style="
                                    border: solid 3px green;
                                    border-radius: 50%;
                                    width: 50px;
                                    height: 50px;
                                    position: relative;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                "
                            />
                        </div>
                        <div style="
                            height: 80px;
                            width: 260px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                        ">
                            <div style="
                                display: flex;
                                flex-direction: row;
                                height: 25pxd;
                            ">
                                <h1 style="
                                    font-size: 1.15rem;
                                    margin: 0 12px 0 0;
                                    white-space: nowrap;
                                ">
                                    ${escape(body.username)}
                                </h1>
                            </div>
                            <h2 style="
                                font-size: 0.75rem;
                                margin: 0;
                                white-space: nowrap;
                                font-weight: 400;
                            ">
                                ${escape(body.email)}
                            </h2>
                        </div>
                    </div>

                    <div style="
                        padding-top: 18px;
                        display: grid;
                        grid-template-columns: repeat(2, 220px);
                        height: ${(Math.round(socialProfiles.length / 2) - 1) * 40}px;
                        margin: 0 15px;
                        font-size: 0.75rem;
                        gap: 10px;
                    ">
                        ${socialProfiles.map((socialProfile, index) => `
                            <div style="
                                width: auto;
                                height: 40px;
                                display: flex;
                                align-items: center;
                            ">
                                <div style="
                                    width: 40px;
                                    height: 40px;
                                    border: solid 0.5px #222;
                                    border-radius: 10px;
                                    background-color: ${rgba(socialProfile.color, 0.3)};
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                "> 
                                    ${brandIcons[index]}
                                </div>
                                <p style="
                                    margin-left: 10px;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    width: 180px;
                                ">
                                    ${socialProfile.label}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                </div>

            </foreignObject>
        </svg>
    `;
}