import { chromium } from 'playwright';
import { leerCasoDePrueba } from './parser';
import * as keywords from './keywords';
import { CasoDePrueba, Paso } from './types';
import type { AccionKeyword } from './keywords';

async function ejecutarPaso(page: any, paso: Paso) {
  const { accion, selector, xpath, valor } = paso;
  const locator = xpath ?? selector;

  if (!(accion in keywords)) {
    throw new Error(`Acción desconocida: ${accion}`);
  }

  switch (accion) {
    case 'ir_a_url':
      if (!valor) throw new Error('Falta el valor (URL) para ir_a_url');
      await keywords.ir_a_url(page, valor);
      break;
    case 'escribir_texto':
      if (!locator || !valor) throw new Error('Faltan selector o valor para escribir_texto');
      await keywords.escribir_texto(page, locator, valor);
      break;
    case 'click':
      if (!locator) throw new Error('Falta el selector para click');
      await keywords.click(page, locator);
      break;
    case 'validar_texto':
      if (!locator || !valor) throw new Error('Faltan selector o valor para validar_texto');
      await keywords.validar_texto(page, locator, valor);
      break;
    default:
      throw new Error(`Acción no soportada: ${accion}`);
  }
}

export async function ejecutarCasoDePrueba(rutaArchivo: string) {
  const caso: CasoDePrueba = await leerCasoDePrueba(rutaArchivo);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`Ejecutando caso: ${caso.titulo}`);

  for (const paso of caso.pasos) {
    console.log(`Ejecutando paso: ${JSON.stringify(paso)}`);
    try {
      await ejecutarPaso(page, paso);
    } catch (error) {
      console.error(`Error en paso: ${JSON.stringify(paso)}`, error);
      break;
    }
  }

  await browser.close();
}