import { chromium, Page } from 'playwright';
import { ejecutarKeyword } from './keywords';
import { Paso, CasoDePruebaBDD } from './types';


async function ejecutarPaso(page: Page, paso: Paso) {
  try {
    await ejecutarKeyword(page, paso);
    console.log(`✅ Paso ejecutado: ${paso.paso_de_prueba}`);
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`❌ Error en paso: ${paso.paso_de_prueba}\n`, err.message);
    throw err; 
  }
}

export async function ejecutarCasoDePrueba(
  casoJson: CasoDePruebaBDD,
  continuarEnError = false
) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const escenarioTitulo = Object.keys(casoJson)[0];
  const escenario = casoJson[escenarioTitulo];

  console.log(`🚀 Ejecutando escenario: "${escenarioTitulo}"`);

  for (const bloque of Object.keys(escenario)) {
    console.log(`🔹 Bloque: ${bloque}`);
    const pasos: Paso[] = escenario[bloque];

    for (const paso of pasos) {
      try {
        await ejecutarPaso(page, {
          ...paso,
          valor: paso.valor ?? undefined,
        });
      } catch (error) {
        if (!continuarEnError) {
          console.log('⛔ Finalizando ejecución por error.');
          await browser.close();
          return;
        }
      }
    }
  }

  await browser.close();
  console.log(`✅ Escenario "${escenarioTitulo}" finalizado`);
}