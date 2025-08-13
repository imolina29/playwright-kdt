// Definición de tipos y estructuras para el caso de prueba y pasos

export interface Paso {
  paso_de_prueba: string; // descripción legible del paso
  tipo?: 'actuar' | 'validar'; // tipo de acción
  accion: string;      // nombre de la keyword a ejecutar
  localizador?: string; // selector CSS o xpath (renombrado a localizador para unificar)
  valor?: string;      // texto o valor (opcional)
}

export interface CasoDePruebaBDD {
  [escenario: string]: {
    [bloque: string]: Paso[];
  };
}