export interface Paso {
  accion: string;             
  selector?: string; 
  xpath?: string; 
  valor?: string;             
}

export interface CasoDePrueba {
  titulo: string;
  pasos: Paso[];
}