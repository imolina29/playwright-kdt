// src/runParser.ts
import { parsearFeature } from './parser';
import * as fs from 'fs';

const rutaFeature = process.argv[2];

if (!rutaFeature) {
  console.error('Por favor provee la ruta al archivo .feature');
  process.exit(1);
}

const resultado = parsearFeature(rutaFeature);
console.log(JSON.stringify(resultado, null, 2));

// Guardar en JSON
const nombreJson = rutaFeature.replace(/\.feature$/i, '.json');
fs.writeFileSync(nombreJson, JSON.stringify(resultado, null, 2));
console.log(`Archivo JSON generado: ${nombreJson}`);