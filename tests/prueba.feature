Feature: pruebas de concepto de KDT autogerando codigo

Escenario: Usuario intenta iniciar sesión con campos vacíos
  Dado que el usuario está en la url "https://dsh9u4zf8izc1.cloudfront.net/vivienda-digital"
  Cuando el usuario haga click en "//*[@id='btn-start']"
  Y el usuario haga click en "//mf-viability-accordion-panel[contains(., 'Compra de inmueble')]"
  Y el usuario haga click en "//label[contains(@class,'mf-viability-destiny-option') and contains(., 'Inmueble usado para vivir')]"
  Entonces el usuario ve habilitado el boton continuar "//*[@id='btn-continue']"