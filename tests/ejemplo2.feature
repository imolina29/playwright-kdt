Título: inicio de sesion en orange

Escenario: inicio de sesion fallido
  Dado que voy a la url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  Cuando escribo "Admin" en el campo "username"
  Y escribo "123nimda" en el campo "password"
  Y hago click en el botón "login"
  Entonces debería ver un error