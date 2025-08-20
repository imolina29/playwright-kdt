// tests/utils/kdtLoader.ts
import fs from 'fs';
import path from 'path';
import { parsearFeature, type FeatureJson } from '../../src/parser';
import type { Paso as PasoKDT } from '../../src/keywords';

/** Mapea el Paso del parser -> Paso que espera keywords.ts */
function mapPasos(escenario: FeatureJson[string]): PasoKDT[] {
  const pasosParser = Object.values(escenario).flat();
  return pasosParser.map((p) => ({
    accion: p.accion,
    // tu keywords.ts acepta selector o xpath; mantenemos ambos por compatibilidad
    selector: p.xpath ?? undefined,
    xpath: p.xpath ?? undefined as any, // el tipo en keywords.ts lo permite
    valor: p.valor == null ? undefined : String(p.valor),
  }));
}

export function cargarEscenariosDesdeFeature(featurePath: string) {
  const feature = parsearFeature(featurePath);
  return Object.keys(feature).map((scenarioName) => ({
    featurePath,
    scenarioName,
    pasos: mapPasos(feature[scenarioName]),
  }));
}

export function cargarEscenariosDesdeCarpeta(dir: string, ext = '.feature') {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(ext))
    .map(f => path.join(dir, f));

  return files.flatMap(fp => cargarEscenariosDesdeFeature(fp));
}