import * as fs from 'fs';
import * as path from 'path';
import { ejecutarCasoDePrueba } from './runner';
import { CasoDePruebaBDD } from './types';

// Tomamos el tag desde la línea de comando
const tag = process.argv[2];
if (!tag) {
  console.error('❌ Debes pasar un tag. Ej: npm run test:tag testcase_002');
  process.exit(1);
}

// Carpeta donde están los JSON de casos de prueba (a nivel de proyecto raíz)
const testsDir = path.join(process.cwd(), 'tests');

// Verificamos si la carpeta existe
if (!fs.existsSync(testsDir)) {
  console.warn(`⚠ La carpeta "${testsDir}" no existe. Creándola automáticamente...`);
  fs.mkdirSync(testsDir, { recursive: true });
}

// Leemos todos los archivos JSON
let files: string[] = [];
try {
  files = fs.readdirSync(testsDir).filter(f => f.endsWith('.json'));
} catch (error: unknown) {
  const err = error as Error;
  console.error(`❌ No se pudo leer la carpeta "${testsDir}":`, err.message);
  process.exit(1);
}

// Buscamos el JSON que tenga el tag correspondiente en el nombre del archivo
let casoBDD: CasoDePruebaBDD | null = null;

for (const file of files) {
  if (!file.includes(tag)) continue; // filtramos por tag en el nombre del archivo

  const filePath = path.join(testsDir, file);
  try {
    const contenido = fs.readFileSync(filePath, 'utf-8');
    const parsed: CasoDePruebaBDD = JSON.parse(contenido);
    casoBDD = parsed;
    break;
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`⚠ Error leyendo o parseando "${file}":`, err.message);
  }
}

// Validamos si encontramos el caso
if (!casoBDD) {
  console.error(`❌ No se encontró un JSON con el tag "${tag}" en la carpeta "${testsDir}"`);
  process.exit(1);
}

// Ejecutamos el caso
(async () => {
  console.log(`\n🚀 Ejecutando caso con tag: ${tag}\n`);
  try {
    await ejecutarCasoDePrueba(casoBDD);
    console.log('✅ Caso ejecutado correctamente');
  } catch (error: unknown) {
    const err = error as Error;
    console.error('❌ Error al ejecutar el caso:', err.message);
  }
})();