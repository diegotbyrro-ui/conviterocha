import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const client = readFileSync(join(root, 'app/experiencia/easy-rota-do-mar/EasyRotaClient.tsx'), 'utf8');
const page = readFileSync(join(root, 'app/experiencia/easy-rota-do-mar/page.tsx'), 'utf8');
const css = readFileSync(join(root, 'app/experiencia/easy-rota-do-mar/easy-rota.css'), 'utf8');
const media = readFileSync(join(root, 'app/api/experiencia/easy-rota-do-mar/media/[id]/route.ts'), 'utf8');

test('R19: pagina marcada para nao indexar', () => {
  assert.match(page, /index: false, follow: false, nocache: true/);
});

test('R19: tipos e suas areas corretos', () => {
  for (const [type, area] of [['slim', '39,19'], ['premium', '45,21'], ['master', '47,91'], ['spazzio', '58,60']]) {
    assert.match(client, new RegExp(`${type}: \\{ name:.*?${area}`));
  }
});

test('R19: terminações 01 a 08 com tipologias documentadas', () => {
  assert.match(client, /endingToType: Record<number, TypeKey>/);
  assert.match(client, /1: 'slim', 2: 'premium', 3: 'premium', 4: 'spazzio', 5: 'spazzio', 6: 'master', 7: 'master', 8: 'slim'/);
  assert.match(client, /setSelectedEnding\(end\)/);
});

test('R19: todos os 33 pontos documentados, sem coordenadas inventadas', () => {
  const numbers = [...client.matchAll(/number: (\d+), name:/g)].map((match) => Number(match[1]));
  assert.deepEqual(numbers, Array.from({ length: 33 }, (_, i) => i + 1));
  assert.match(client, /A posição exata de cada um será aplicada/);
});

test('R19: nenhuma captura de lead ou preço em ambiente de homologacao', () => {
  assert.doesNotMatch(client, /<form\b|createClient\(|supabase\.from\(/i);
  assert.match(client, /sem cadastro de leads/i);
  assert.match(client, /sem consulta de disponibilidade/i);
});

test('R19: proxy so aceita IDs permitidos, limita bytes e tipo de arquivo', () => {
  assert.match(media, /Object\.prototype\.hasOwnProperty\.call\(allowed, id\)/);
  assert.match(media, /const MAX_IMAGE_BYTES/);
  assert.match(media, /reader\.read\(\)/);
  assert.match(media, /image\/jpeg/);
  assert.doesNotMatch(media, /searchParams\.get\(['"]url['"]\)/);
});

test('R19: CSS escopado, sem influenciar convites/admin', () => {
  assert.match(css, /CSS deliberadamente isolado sob \.erm19/);
  assert.doesNotMatch(css, /\bbody\s*\{|\bhtml\s*\{/);
});

test('R19: navegação acessível e galeria com controle por teclado', () => {
  assert.match(client, /aria-pressed=/);
  assert.match(client, /aria-label=/);
  assert.match(client, /event\.key === 'Escape'/);
  assert.match(client, /event\.key === 'ArrowRight'/);
});
