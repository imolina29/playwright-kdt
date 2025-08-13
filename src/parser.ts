import { promises as fs } from 'fs';
import { CasoDePrueba } from './types';

export async function leerCasoDePrueba(ruta: string): Promise<CasoDePrueba> {
  const contenido = await fs.readFile(ruta, 'utf-8');
  const caso = JSON.parse(contenido) as CasoDePrueba;

  if (!caso.titulo || !Array.isArray(caso.pasos)) {
    throw new Error('Archivo JSON no tiene la estructura correcta.');
  }

  return caso;
}