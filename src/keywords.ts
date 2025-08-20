import { Page, Locator } from 'playwright';
import { resolveLocator } from './locatorResolver';

/**
 * Paso del KDT:
 * - accion: keyword a ejecutar
 * - selector/xpath: alias o selector a resolver (preferir alias modulo.clave)
 * - valor: dato adicional (URL, texto, segundos, opción de <select>, tecla, etc.)
 */
export interface Paso {
  accion: string;
  selector?: string;
  xpath?: string;
  valor?: string; // Para espera/URL/texto/opción/tecla
}

/* =========================
 * Utilidades internas
 * ========================= */

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_WAIT_SECONDS = 5;

function logStep(msg: string) {
  console.log(`[KDT] ${msg}`);
}

function toSeconds(valor?: string, fallback = DEFAULT_WAIT_SECONDS): number {
  if (valor === undefined || valor === null || valor === '') return fallback;
  const n = Number(valor);
  if (Number.isNaN(n) || n < 0) throw new Error(`Valor inválido para segundos: "${valor}"`);
  return n;
}

/**
 * Resuelve un string que puede ser:
 *  - URL absoluta (http/https) -> se usa tal cual
 *  - Alias tipo "modulo.clave" -> se resuelve con resolveLocator (debe devolver URL absoluta)
 */
function resolveUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;

  // Intentar resolver como alias con el diccionario central
  const resolved = resolveLocator(input);
  if (/^https?:\/\//i.test(resolved)) return resolved;

  throw new Error(
    `No se pudo resolver una URL válida desde "${input}".` +
      ` Asegúrate de que el alias exista y contenga una URL absoluta (http/https).`
  );
}

/**
 * Resuelve un locator a partir de:
 *  - xpath (si se usa)
 *  - selector (alias recomendado: modulo.clave)
 * Devuelve el Locator de Playwright con auto-wait listo.
 */
function locatorFrom(page: Page, raw: string): Locator {
  const sel = resolveLocator(String(raw));
  return page.locator(sel);
}

/* =========================
 * Acciones base
 * ========================= */

async function navegarA(page: Page, targetUrl: string) {
  const url = resolveUrl(targetUrl);
  logStep(`Navegar -> ${targetUrl} -> ${url}`);
  await page.goto(url, { waitUntil: 'load', timeout: DEFAULT_TIMEOUT_MS });
}

async function escribirTexto(page: Page, raw: string, texto: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Escribir -> "${texto}" en ${raw}`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
  await loc.fill(texto, { timeout: DEFAULT_TIMEOUT_MS });
}

async function clickEn(page: Page, raw: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Click -> ${raw}`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
  await loc.click({ timeout: DEFAULT_TIMEOUT_MS });
}

async function validarTexto(page: Page, raw: string, esperado: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Validar texto -> "${esperado}" en ${raw}`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
  const texto = await loc.textContent({ timeout: DEFAULT_TIMEOUT_MS });
  if (!texto || !texto.includes(esperado)) {
    throw new Error(`El texto esperado "${esperado}" no se encontró en "${raw}". Texto real: "${texto ?? ''}"`);
  }
}

async function esperarVisible(page: Page, raw: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Esperar visible -> ${raw}`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
}

async function esperarInvisible(page: Page, raw: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Esperar invisible -> ${raw}`);
  await loc.waitFor({ state: 'hidden', timeout: DEFAULT_TIMEOUT_MS });
}

async function assertHabilitado(page: Page, raw: string, esperadoHabilitado: boolean) {
  const loc = locatorFrom(page, raw);
  logStep(`Assert habilitado(${esperadoHabilitado}) -> ${raw}`);
  await loc.waitFor({ state: 'attached', timeout: DEFAULT_TIMEOUT_MS });
  const enabled = await loc.isEnabled();
  if (esperadoHabilitado && !enabled) {
    throw new Error(`El elemento "${raw}" NO está habilitado`);
  }
  if (!esperadoHabilitado && enabled) {
    throw new Error(`El elemento "${raw}" está habilitado y debería estar inhabilitado`);
  }
}

async function assertVisible(page: Page, raw: string, esperadoVisible: boolean) {
  const loc = locatorFrom(page, raw);
  logStep(`Assert visible(${esperadoVisible}) -> ${raw}`);
  const visible = await loc.isVisible();
  if (esperadoVisible && !visible) throw new Error(`El elemento "${raw}" NO está visible`);
  if (!esperadoVisible && visible) throw new Error(`El elemento "${raw}" está visible y debería estar oculto`);
}

/* =========================
 * Acciones extra comunes
 * ========================= */

async function hoverEn(page: Page, raw: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Hover -> ${raw}`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
  await loc.hover({ timeout: DEFAULT_TIMEOUT_MS });
}

async function presionarTecla(page: Page, tecla: string) {
  logStep(`Tecla -> ${tecla}`);
  await page.keyboard.press(tecla, { delay: 0 });
}

async function seleccionarOpcion(page: Page, raw: string, valueOrLabel: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Select -> ${raw} = "${valueOrLabel}"`);
  await loc.waitFor({ state: 'visible', timeout: DEFAULT_TIMEOUT_MS });
  // Intenta por valor y por label, el que funcione primero
  const result = await loc.selectOption({ value: valueOrLabel }).catch(() => loc.selectOption({ label: valueOrLabel }));
  if (!result || result.length === 0) {
    throw new Error(`No se pudo seleccionar la opción "${valueOrLabel}" en "${raw}"`);
  }
}

async function scrollHasta(page: Page, raw: string) {
  const loc = locatorFrom(page, raw);
  logStep(`Scroll a -> ${raw}`);
  await loc.scrollIntoViewIfNeeded({ timeout: DEFAULT_TIMEOUTMS_SAFE() });
}

function DEFAULT_TIMEOUTMS_SAFE() {
  // Separado para evitar typo en constantes al llamar; devuelve el mismo timeout
  return DEFAULT_TIMEOUT_MS;
}

/* =========================
 * Ejecutor principal
 * ========================= */

export async function ejecutarKeyword(page: Page, paso: Paso) {
  const { accion, selector, xpath, valor } = paso;

  // Compatibilidad: aceptar xpath o selector (preferir alias)
  const rawLocator = xpath ?? selector ?? null;

  switch (accion) {
    /* Navegación */
    case 'ir_a_url': {
      if (!valor) throw new Error('Falta valor (URL o alias) para ir_a_url');
      await navegarA(page, valor);
      break;
    }

    /* Interacción básica */
    case 'escribir_texto': {
      if (!rawLocator || valor === undefined || valor === null) {
        throw new Error('Faltan selector y/o valor para escribir_texto');
      }
      await escribirTexto(page, rawLocator, String(valor));
      break;
    }

    case 'clickear': {
      if (!rawLocator) throw new Error('Falta selector para clickear');
      await clickEn(page, rawLocator);
      break;
    }

    /* Validaciones */
    case 'validar_texto': {
      if (!rawLocator || valor === undefined || valor === null) {
        throw new Error('Faltan selector y/o valor para validar_texto');
      }
      await validarTexto(page, rawLocator, String(valor));
      break;
    }

    case 'esta_visible': {
      if (!rawLocator) throw new Error('Falta selector para esta_visible');
      await assertVisible(page, rawLocator, true);
      break;
    }

    case 'esta_invisible': {
      if (!rawLocator) throw new Error('Falta selector para esta_invisible');
      await assertVisible(page, rawLocator, false);
      break;
    }

    case 'esta_activo':
    case 'esta_habilitado': {
      if (!rawLocator) throw new Error(`Falta selector para ${accion}`);
      await assertHabilitado(page, rawLocator, true);
      break;
    }

    case 'esta_inactivo':
    case 'esta_inhabilitado': {
      if (!rawLocator) throw new Error(`Falta selector para ${accion}`);
      await assertHabilitado(page, rawLocator, false);
      break;
    }

    /* Esperas explícitas */
    case 'espera': {
      const segundos = toSeconds(valor);
      logStep(`Esperar ${segundos} segundos`);
      await new Promise((r) => setTimeout(r, segundos * 1000));
      break;
    }

    case 'espera_visible': {
      if (!rawLocator) throw new Error('Falta selector para espera_visible');
      await esperarVisible(page, rawLocator);
      break;
    }

    case 'espera_invisible': {
      if (!rawLocator) throw new Error('Falta selector para espera_invisible');
      await esperarInvisible(page, rawLocator);
      break;
    }

    /* Scroll */
    case 'scroll_abajo': {
      const px = 1; // Scroll por viewport completo
      logStep(`Scroll abajo (viewport)`);
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      break;
    }

    case 'scroll_arriba': {
      logStep(`Scroll arriba (viewport)`);
      await page.evaluate(() => window.scrollBy(0, -window.innerHeight));
      break;
    }

    case 'scroll_hasta': {
      if (!rawLocator) throw new Error('Falta selector para scroll_hasta');
      await scrollHasta(page, rawLocator);
      break;
    }

    /* Extras útiles */
    case 'hover': {
      if (!rawLocator) throw new Error('Falta selector para hover');
      await hoverEn(page, rawLocator);
      break;
    }

    case 'presionar_tecla': {
      if (!valor) throw new Error('Falta valor (tecla) para presionar_tecla. Ej: "Enter"');
      await presionarTecla(page, valor);
      break;
    }

    case 'seleccionar_opcion': {
      if (!rawLocator || !valor) throw new Error('Faltan selector o valor para seleccionar_opcion');
      await seleccionarOpcion(page, rawLocator, valor);
      break;
    }

    default:
      throw new Error(`Acción no soportada: ${accion}`);
  }
}