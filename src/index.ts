import { ejecutarCasoDePrueba } from './runner';

const ruta = './tests/ejemplo.json';

ejecutarCasoDePrueba(ruta)
  .then(() => console.log('Test finalizado'))
  .catch(console.error);