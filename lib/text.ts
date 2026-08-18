const mojibakeMap: Record<string, string> = {
  'Ã¡': 'á', 'Ã ': 'à', 'Ã¢': 'â', 'Ã£': 'ã', 'Ã¤': 'ä',
  'Ã©': 'é', 'Ã¨': 'è', 'Ãª': 'ê', 'Ã«': 'ë',
  'Ã­': 'í', 'Ã¬': 'ì', 'Ã®': 'î', 'Ã¯': 'ï',
  'Ã³': 'ó', 'Ã²': 'ò', 'Ã´': 'ô', 'Ãµ': 'õ', 'Ã¶': 'ö',
  'Ãº': 'ú', 'Ã¹': 'ù', 'Ã»': 'û', 'Ã¼': 'ü',
  'Ã§': 'ç', 'Ã±': 'ñ',
  'Ã': 'Á', 'Ã€': 'À', 'Ã‚': 'Â', 'Ãƒ': 'Ã',
  'Ã‰': 'É', 'ÃŠ': 'Ê', 'Ã': 'Í',
  'Ã“': 'Ó', 'Ã”': 'Ô', 'Ã•': 'Õ', 'Ãš': 'Ú', 'Ã‡': 'Ç',
  'Â°': '°', 'Âº': 'º', 'Âª': 'ª', 'Â·': '·', 'Â': ''
};

const knownValues: Record<string, string> = {
  'Corretor de imobili�ria': 'Corretor de imobiliária',
  'Corretor de imobiliaria': 'Corretor de imobiliária',
  'Corretor aut�nomo': 'Corretor autônomo',
  'Corretor autonomo': 'Corretor autônomo',
  'Imobili�ria / parceiro comercial': 'Imobiliária / parceiro comercial',
  'Imobiliaria / parceiro comercial': 'Imobiliária / parceiro comercial',
  'Gestor ou l�der de equipe': 'Gestor ou líder de equipe',
  'Gestor ou lider de equipe': 'Gestor ou líder de equipe',
  'Ainda n�o': 'Ainda não',
  'Ainda nao': 'Ainda não',
  'N�o': 'Não',
  'Nao': 'Não',
  'Sim': 'Sim'
};

export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  let text = String(value).trim();

  if (knownValues[text]) return knownValues[text];

  for (const [bad, good] of Object.entries(mojibakeMap)) {
    text = text.split(bad).join(good);
  }

  if (knownValues[text]) return knownValues[text];

  // Correções seguras para opções conhecidas do formulário quando houve perda de byte.
  text = text
    .replace(/imobili.ria/gi, (m) => m[0] === 'I' ? 'Imobiliária' : 'imobiliária')
    .replace(/aut.nomo/gi, (m) => m[0] === 'A' ? 'Autônomo' : 'autônomo')
    .replace(/l.der/gi, (m) => m[0] === 'L' ? 'Líder' : 'líder')
    .replace(/Ainda n.o/gi, 'Ainda não');

  return text;
}

export function normalizeLead<T extends Record<string, any>>(lead: T): T {
  const output: Record<string, any> = { ...lead };
  const textFields = [
    'name', 'phone', 'email', 'creci', 'brokerage', 'broker_profile',
    'interest', 'relationship', 'utm_source', 'utm_medium', 'utm_campaign', 'referrer'
  ];

  for (const field of textFields) {
    if (field in output && output[field] !== null && output[field] !== undefined) {
      output[field] = normalizeText(output[field]);
    }
  }

  return output as T;
}
