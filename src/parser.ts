// src/parser.ts
import * as fs from 'fs';
import { stepMappings, StepMapping } from './stepMappings';

export interface Paso {
  paso_de_prueba: string;
  tipo: 'actuar' | 'validar';
  accion: string;
  xpath: string | null;
  valor: any | null;
}

export interface Escenario {
  [bloque: string]: Paso[];
}

export interface FeatureJson {
  [tituloEscenario: string]: Escenario;
}

export function parsearFeature(rutaArchivo: string): FeatureJson {
  const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
  const lineas = contenido.split(/\r?\n/);

  const featureJson: FeatureJson = {};
  let escenarioActual: string | null = null;
  let bloqueActual: string | null = null;

  for (const linea of lineas) {
    const l = linea.trim();

    // Ignorar líneas vacías o comentarios
    if (!l || l.startsWith('#')) continue;

    // Detectar Scenario / Escenario
    const matchScenario = l.match(/^(Escenario|Scenario|Scenario Outline):\s*(.*)$/i);
    if (matchScenario) {
      escenarioActual = matchScenario[2].trim();
      featureJson[escenarioActual] = {};
      bloqueActual = null;
      continue;
    }

    // Detectar bloques Dado, Cuando, Entonces, Y
    const matchBloque = l.match(/^(Dado que|Cuando|Entonces|Y)\s*(.*)$/i);
    if (matchBloque && escenarioActual) {
      bloqueActual = l; // usamos toda la línea como título del bloque
      if (!featureJson[escenarioActual][bloqueActual]) {
        featureJson[escenarioActual][bloqueActual] = [];
      }

      // Intentar mapear paso a acción
      const mapping = stepMappings.find(m => m.regex.test(l));
      if (mapping) {
        const matches = l.match(mapping.regex);
        if (matches) {
          const paso: Paso = {
            paso_de_prueba: l,
            tipo: mapping.tipo,
            accion: mapping.accion,
            xpath: mapping.xpathGrupo ? matches[mapping.xpathGrupo] : null,
            valor: mapping.valorGrupo ? matches[mapping.valorGrupo] : null,
          };
          featureJson[escenarioActual][bloqueActual].push(paso);
        }
      }

      continue;
    }
  }

  return featureJson;
}