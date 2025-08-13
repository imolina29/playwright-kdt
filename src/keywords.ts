import { Page } from 'playwright';


export type AccionKeyword = keyof typeof keywords;
export const keywords = {
  ir_a_url,
  escribir_texto,
  click,
  validar_texto,
};

export async function ir_a_url(page: Page, url: string) {
  await page.goto(url);
}

export async function escribir_texto(page: Page, xpath: string, texto: string) {
  const element = await page.waitForSelector(`xpath=${xpath}`, { timeout: 5000 });
  if (!element) throw new Error(`Elemento no encontrado para xpath: ${xpath}`);
  await element.fill(texto);
}

export async function click(page: Page, xpath: string) {
  const element = await page.waitForSelector(`xpath=${xpath}`, { timeout: 5000 });
  if (!element) throw new Error(`Elemento no encontrado para xpath: ${xpath}`);
  await element.click();
}

export async function validar_texto(page: Page, xpath: string, texto: string) {
  const element = await page.waitForSelector(`xpath=${xpath}`, { timeout: 5000 });
  if (!element) throw new Error(`Elemento no encontrado para xpath: ${xpath}`);
  const contenido = await element.textContent();
  if (!contenido || !contenido.includes(texto)) {
    throw new Error(`Texto "${texto}" no encontrado en xpath "${xpath}".`);
  }
}