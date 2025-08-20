Escenario: Usuario intenta iniciar sesión con campos vacíos
  Dado que el usuario está en la url "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
  Cuando el usuario escribe en el campo "//input[@name='username']"
  Y el usuario escribe en el campo "//input[@name='password']"
  Y hace clic en el botón Login "//button[@type='submit']"
  Entonces se debe mostrar un mensaje de error "Required" "//span[@class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message' and contains(.,'Required')]"
  Y se debe mostrar un mensaje de error "Required" "//span[@class='oxd-text oxd-text--span oxd-input-field-error-message oxd-input-group__message' and contains(.,'Required')]"