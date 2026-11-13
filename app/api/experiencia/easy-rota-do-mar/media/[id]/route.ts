import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// R19: lista fechada de imagens PUBLICAS que ja constam no site oficial.
// Nao recebe URL do cliente e nao acessa Drive, Supabase ou dados privados.
const allowed: Record<string, string> = {
  hero: 'galeria/1/46/20260823184041_6a8b68d9bedd4.jpg',
  fachada: 'galeria/1/46/20260823184043_6a8b68db677c7.jpg',
  piscina: 'galeria/1/46/20260823184044_6a8b68dc51ebe.jpg',
  kids: 'galeria/1/46/20260823184045_6a8b68dd1a986.jpg',
  fitness: 'galeria/1/46/20260823184045_6a8b68ddbc10b.jpg',
  market: 'galeria/1/46/20260823184046_6a8b68dec9920.jpg',
  recarga: 'galeria/1/46/20260823184047_6a8b68df92bc1.jpg',
  slim: 'galeria/1/47/20260823191054_6a8b6feee105c.jpg',
  premium: 'galeria/1/47/20260823191057_6a8b6ff1538b0.jpg',
  master: 'galeria/1/47/20260823191058_6a8b6ff2e6b81.jpg',
  spazzio: 'galeria/1/47/20260823192655_6a8b73afe457c.jpg',
  'spazzio-3d': 'galeria/1/47/20260823184137_6a8b69115903c.jpg',
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const file = Object.prototype.hasOwnProperty.call(allowed, id) ? allowed[id] : null;
  if (!file) return NextResponse.json({ error: 'Imagem nao encontrada.' }, { status: 404 });

  const url = new URL('https://sgw.meurocha.com.br/storage/inc_thumb3.php');
  url.searchParams.set('arquivo', file);
  url.searchParams.set('largura', '1400');
  url.searchParams.set('qualidade', '82');

  try {
    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(12000),
      redirect: 'error',
      cache: 'no-store',
      headers: { Accept: 'image/jpeg,image/png,image/webp' },
    });
    if (!response.ok || !response.body) throw new Error('Falha na origem da imagem');
    const contentType = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) throw new Error('Tipo inesperado');
    const declaredSize = Number(response.headers.get('content-length') || 0);
    if (declaredSize > MAX_IMAGE_BYTES) throw new Error('Imagem grande demais');

    // Limita tambem o corpo quando a origem nao informa Content-Length.
    const chunks: Uint8Array[] = [];
    let total = 0;
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_IMAGE_BYTES) {
        await reader.cancel();
        throw new Error('Limite de bytes excedido');
      }
      chunks.push(value);
    }
    const body = new ArrayBuffer(total);
    const bytes = new Uint8Array(body);
    let offset = 0;
    for (const part of chunks) { bytes.set(part, offset); offset += part.byteLength; }

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Imagem temporariamente indisponivel na origem oficial.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
