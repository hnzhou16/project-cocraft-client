import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const imageUrl = req.nextUrl.searchParams.get('url');
  const prompt = req.nextUrl.searchParams.get('prompt') || 'image';

  if (!imageUrl) {
    return NextResponse.json({error: 'Missing image URL'}, {status: 400});
  }

  try {
    // server-side fetch of the remote image
    const res = await fetch(imageUrl);
    if (!res.ok) {
      return NextResponse.json({error: 'Failed to fetch image'}, {status: 500});
    }

    const arrayBuffer = await res.arrayBuffer();
    const filename = `${prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`;

    return new NextResponse(new Uint8Array(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({error: 'Download failed'}, {status: 500});
  }
}