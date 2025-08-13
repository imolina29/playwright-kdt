// src/stepMappings.ts
export interface StepMapping {
  regex: RegExp;
  accion: string;
  tipo: 'actuar' | 'validar';
  xpathGrupo?: number; // número del grupo de regex que contiene el xpath
  valorGrupo?: number; // número del grupo de regex que contiene el valor
}

export const stepMappings: StepMapping[] = [
  {
    regex: /^Dado que el usuario está en la url "(.*)"$/i,
    accion: 'ir_a_url',
    tipo: 'actuar',
    valorGrupo: 1,
  },
  {
    regex: /^Cuando el usuario escribo "(.*)" un nombre de usuario inválido "(.*)"$/i,
    accion: 'escribir_texto',
    tipo: 'actuar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },
  {
    regex: /^Y el usuario escribe "(.*)" una contraseña incorrecta "(.*)"$/i,
    accion: 'escribir_texto',
    tipo: 'actuar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },
  {
    regex: /^Y hace clic en el botón "(.*)"$/i,
    accion: 'clickear',
    tipo: 'actuar',
    xpathGrupo: 1,
  },
  {
    regex: /^Entonces se debe mostrar un mensaje de error "(.*)"$/i,
    accion: 'validar_texto',
    tipo: 'validar',
    valorGrupo: 1,
  },
  {
    regex: /^Y el usuario debe permanecer en la página de login$/i,
    accion: 'esta_visible',
    tipo: 'validar',
    xpathGrupo: 1,
  },
  // Puedes agregar más patrones aquí sin modificar parser.ts
];