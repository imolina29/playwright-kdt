Scenario: Usuario intenta iniciar sesión con credenciales incorrectas
  Dado que el usuario está en la url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  Cuando el usuario escribo "admin_wrong" un nombre de usuario inválido "//input[@name='username']"
  Y el usuario escribe "wrong_pass" una contraseña incorrecta "//input[@name='password']"
  Y hace clic en el botón "Login"
  Entonces se debe mostrar un mensaje de error "Invalid credentials"
  Y el usuario debe permanecer en la página de login