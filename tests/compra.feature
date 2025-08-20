Feature: Compra rápida en e-commerce

Background:
  Dado que el usuario está en la url "https://demo.fake-shop.com"

Escenario: Usuario busca un producto y lo añade al carrito
  Cuando el usuario escribe "zapatillas running" en "//input[@name='search']"
  Y el usuario haga click en "//button[@id='btn-search']"
  Entonces el usuario debe ver el texto "Resultados" en "//h1[contains(.,'Resultados')]"
  Y el usuario haga click en "//a[contains(.,'Zapatillas Running Pro')]"
  Y el usuario haga click en "//button[@id='add-to-cart']"
  Entonces el usuario debe ver el texto "Producto agregado al carrito" en "//div[@class='toast']"