// src/stepMappings.ts

export interface StepMapping {
  regex: RegExp;
  accion: string;
  tipo: 'actuar' | 'validar';
  xpathGrupo?: number;          // índice del grupo de regex que contiene el XPATH
  valorGrupo?: number;          // índice del grupo de regex que contiene el valor
  defaultXPath?: string | null; // XPATH por defecto si no viene en la línea
  defaultValor?: any | null;    // valor por defecto si no viene en la línea
}

export const stepMappings: StepMapping[] = [
  // 1) Navegar a URL
  {
    // Dado que el usuario está en la url "https://...."
    regex: /^(?:dado que)\s+el usuario\s+está\s+en la url\s+"([^"]+)"$/i,
    accion: 'ir_a_url',
    tipo: 'actuar',
    valorGrupo: 1,
  },

  // 2) Escribir texto (genérico, cubre "escribe"/"escribo")
  {
    // Cuando|Y el usuario escribe|escribo "VALOR" ... "XPATH"
    // Ej.: Cuando el usuario escribo "admin_wrong" ... "//input[@name='username']"
    //     Y el usuario escribe "password" en "//input[@name='password']"
    regex: /^(?:cuando|y)\s+el usuario\s+escrib(?:e|o)\s+"([^"]+)"[\s\S]*?"([^"]+)"$/i,
    accion: 'escribir_texto',
    tipo: 'actuar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },

  {
    // Variantes admitidas:
    // "Cuando el usuario haga click en "XPATH""
    // "Cuando el usuario hace clic en "XPATH""
    // "Y el usuario haga clic en "XPATH""
    // "Y hace clic en "XPATH""
    regex: /^(?:cuando|y)\s+(?:(?:el\s+usuario)\s+)?(?:hace|haga)\s+cli(?:c|ck)\s+en\s+"([^"]+)"$/i,
    accion: 'clickear',
    tipo: 'actuar',
    xpathGrupo: 1,
  },

  {
    // Entonces se debe mostrar un mensaje de error "Invalid credentials"
    regex: /^entonces\s+se debe mostrar un mensaje de error\s+"([^"]+)"$/i,
    accion: 'validar_texto',
    tipo: 'validar',
    valorGrupo: 1,
    defaultXPath: 'body', // buscamos el texto en todo el body
  },

  {
    // Y el usuario debe permanecer en la página de login
    regex: /^y\s+el usuario\s+debe permanecer en la página de login$/i,
    accion: 'esta_visible',
    tipo: 'validar',
    // OrangeHRM: <h5> con 'Login'
    defaultXPath: `//h5[contains(normalize-space(.),'Login')]`,
  },

  // --- Ejemplos específicos que ya tenías (se mantienen) ---
  {
    // Cuando el usuario escribo "VALOR" un nombre de usuario inválido "XPATH"
    regex: /^cuando\s+el usuario\s+escribo\s+"([^"]+)"\s+un nombre de usuario inválido\s+"([^"]+)"$/i,
    accion: 'escribir_texto',
    tipo: 'actuar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },
  {
    // Y el usuario escribe "VALOR" una contraseña incorrecta "XPATH"
    regex: /^y\s+el usuario\s+escribe\s+"([^"]+)"\s+una contraseña incorrecta\s+"([^"]+)"$/i,
    accion: 'escribir_texto',
    tipo: 'actuar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },
  {
    // Y hace clic en "XPATH"
    regex: /^y\s+hace\s+cli(?:c|ck)\s+en\s+"([^"]+)"$/i,
    accion: 'clickear',
    tipo: 'actuar',
    xpathGrupo: 1,
  },
  {
    regex: /^entonces\s+el usuario\s+debe ver el texto\s+"([^"]+)"\s+en\s+"([^"]+)"$/i,
    accion: 'validar_texto',
    tipo: 'validar',
    valorGrupo: 1,
    xpathGrupo: 2,
  },
// Validar que un campo contiene valor
{
  // Ejemplo: Entonces|Cuando|Y el campo "//input[@id='nombre']" contiene valor
  regex: /^(?:entonces|cuando|y)\s+el campo\s+"([^"]+)"\s+contiene\s+valor$/i,
  accion: 'campo_contiene_valor',
  tipo: 'validar',
  xpathGrupo: 1,
},

// Validar que un campo está vacío
{
  // Ejemplo: Entonces|Cuando|Y el campo "//input[@id='nombre']" está vacío
  regex: /^(?:entonces|cuando|y)\s+el campo\s+"([^"]+)"\s+está\s+vac(i|í)o$/i,
  accion: 'campo_esta_vacio',
  tipo: 'validar',
  xpathGrupo: 1,
},
];