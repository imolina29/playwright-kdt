import * as fs from 'fs';
import * as path from 'path';

let cache: Record<string, string> | null = null;

function looksLikeSelectorOrXPath(s: string): boolean {
  const t = s.trim();
  return t.startsWith('//') || t.startsWith('.//') || t.startsWith('#') || t.startsWith('.') || t.startsWith('[');
}

export function resolveLocator(keyOrSelector: string): string {
  // Si ya es selector/xpath “crudo”, úsalo directo.
  if (looksLikeSelectorOrXPath(keyOrSelector)) return keyOrSelector;

  // Carga perezosa del diccionario
  if (!cache) {
    const file = path.join(process.cwd(), 'src', 'locators', 'locators.json');
    const raw = fs.readFileSync(file, 'utf-8');
    cache = JSON.parse(raw);
  }

  const resolved = cache![keyOrSelector];
  if (!resolved) {
    throw new Error(`No se encontró alias de localizador: "${keyOrSelector}". Agrega una entrada en src/locators/locators.json`);
  }
  return resolved;
}