export const encodeBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${response.headers.get('content-type')};base64,${base64}`;
}