# language: es
Feature: pruebas de concepto de KDT autogenerando código

  Scenario Outline: primeros clicks en AG
    Dado que el usuario está en la "<url>" de autogestion
    Cuando el usuario haga click en "<comenzar>"
    Y el usuario haga click en "<compra_inmueble>"
    Y el usuario haga click en "<inmueble_usado>"
    Entonces el usuario ve habilitado el boton "<continuar>"

    Examples:
      | url                                                      | comenzar        | compra_inmueble                                                             | inmueble_usado                                                                                           | continuar         |
      | https://dsh9u4zf8izc1.cloudfront.net/vivienda-digital   | //*[@id='btn-start'] | //mf-viability-accordion-panel[contains(., 'Compra de inmueble')]       | //label[contains(@class,'mf-viability-destiny-option') and contains(., 'Inmueble usado para vivir')]     | //*[@id='btn-continue'] |