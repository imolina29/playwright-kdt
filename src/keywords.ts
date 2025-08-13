import { Page } from 'playwright';

export interface Paso {
  accion: string;
  selector?: string;
  xpath?: string;
  valor?: string; // Para espera, opcionalmente puedes pasar los segundos
}

export async function ejecutarKeyword(page: Page, paso: Paso) {
  const { accion, selector, xpath, valor } = paso;
  const locator = xpath ?? selector;

  switch (accion) {
    case 'ir_a_url':
      if (!valor) throw new Error('Falta valor (URL) para ir_a_url');
      await page.goto(valor);
      break;

    case 'escribir_texto':
      if (!locator || !valor) throw new Error('Faltan selector o valor para escribir_texto');
      await page.fill(locator, valor);
      break;

    case 'clickear':
      if (!locator) throw new Error('Falta selector para clickear');
      await page.click(locator);
      break;

    case 'validar_texto':
      if (!locator || !valor) throw new Error('Faltan selector o valor para validar_texto');
      const textoElemento = await page.textContent(locator);
      if (!textoElemento || !textoElemento.includes(valor)) {
        throw new Error(`El texto esperado "${valor}" no se encontró en el selector "${locator}"`);
      }
      break;

    case 'scroll_abajo':
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      break;

    case 'scroll_arriba':
      await page.evaluate(() => window.scrollBy(0, -window.innerHeight));
      break;

    // --- NUEVAS ACCIONES ---
    case 'esta_visible':
      if (!locator) throw new Error('Falta selector para esta_visible');
      if (!(await page.isVisible(locator))) {
        throw new Error(`El elemento "${locator}" NO está visible`);
      }
      break;

    case 'esta_invisible':
      if (!locator) throw new Error('Falta selector para esta_invisible');
      if (!(await page.isHidden(locator))) {
        throw new Error(`El elemento "${locator}" NO está invisible`);
      }
      break;

    case 'esta_activo':
      if (!locator) throw new Error('Falta selector para esta_activo');
      if (!(await page.isEnabled(locator))) {
        throw new Error(`El elemento "${locator}" NO está activo/habilitado`);
      }
      break;

    case 'esta_inactivo':
      if (!locator) throw new Error('Falta selector para esta_inactivo');
      if (await page.isEnabled(locator)) {
        throw new Error(`El elemento "${locator}" NO está inactivo/deshabilitado`);
      }
      break;

    case 'esta_habilitado':
      if (!locator) throw new Error('Falta selector para esta_habilitado');
      if (!(await page.isEditable(locator))) {
        throw new Error(`El elemento "${locator}" NO está habilitado para edición`);
      }
      break;

    case 'esta_inhabilitado':
      if (!locator) throw new Error('Falta selector para esta_inhabilitado');
      if (await page.isEditable(locator)) {
        throw new Error(`El elemento "${locator}" NO está inhabilitado`);
      }
      break;

    case 'espera':
      // Si valor es un número, lo usamos; si no, por defecto 5 segundos
      const segundos = valor ? Number(valor) : 5;
      if (isNaN(segundos) || segundos < 0) throw new Error(`Valor inválido para espera: ${valor}`);
      console.log(`⏳ Esperando ${segundos} segundos...`);
      await new Promise(resolve => setTimeout(resolve, segundos * 1000));
      break;

    default:
      throw new Error(`Acción no soportada: ${accion}`);
  }
}