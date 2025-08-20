// tests/kdt.spec.ts
import { test } from '@playwright/test';
import { ejecutarKeyword } from '../src/keywords';
import { cargarEscenariosDesdeCarpeta, cargarEscenariosDesdeFeature } from './utils/kdtLoader';

const BASE_DIR = 'tests';

// Filtros opcionales por ENV (útiles en CI o local)
const FEATURE_FILTER = process.env.FEATURE || '';    // p.ej. FEATURE=prueba3.feature
const SCENARIO_FILTER = process.env.SCENARIO || '';  // p.ej. SCENARIO="Primeros clics"

const all = (() => {
  if (FEATURE_FILTER) {
    return cargarEscenariosDesdeFeature(`${BASE_DIR}/${FEATURE_FILTER}`)
      .filter(e => (SCENARIO_FILTER ? e.scenarioName.includes(SCENARIO_FILTER) : true));
  }
  return cargarEscenariosDesdeCarpeta(BASE_DIR)
    .filter(e => (SCENARIO_FILTER ? e.scenarioName.includes(SCENARIO_FILTER) : true));
})();

test.describe.parallel('KDT', () => {
  for (const entry of all) {
    test(`${entry.scenarioName}  (${entry.featurePath})`, async ({ page }) => {
      for (const paso of entry.pasos) {
        await test.step(`${paso.accion} ${paso.selector ?? paso.xpath ?? paso.valor ?? ''}`.trim(), async () => {
          await ejecutarKeyword(page, paso);
        });
      }
    });
  }
});