# UI Automation — MaterialLoginExample

Automatización de los flujos de **inicio de sesión** y **registro de usuario** de la
aplicación Android `MaterialLoginExample.apk`, usando **WebdriverIO + Appium + Cucumber**
y el patrón **Page Object Model**.

## Stack

| Herramienta   | Uso                                        |
| ------------- | ------------------------------------------ |
| Node.js       | Runtime                                    |
| WebdriverIO 9 | Test runner / cliente de automatización    |
| Appium 2      | Servidor de automatización móvil           |
| UiAutomator2  | Driver de Android                          |
| Cucumber      | Escenarios BDD (Gherkin)                   |
| GitHub Actions| Pipeline CI/CD                             |

## Arquitectura del proyecto

```
ui-automation/
├── app/
│   └── MaterialLoginExample.apk      # App bajo prueba
├── features/
│   ├── login.feature                 # Escenarios de login (Gherkin)
│   ├── signup.feature                # Escenarios de registro (Gherkin)
│   └── step-definitions/
│       ├── login.steps.js            # Steps de login
│       └── signup.steps.js           # Steps de registro
├── pageobjects/                      # Patrón Page Object Model
│   ├── page.js                       # Page base (helpers comunes)
│   ├── login.page.js                 # Page de login
│   └── signup.page.js                # Page de registro
├── .github/workflows/ui-tests.yml    # Pipeline CI (GitHub Actions)
├── wdio.conf.js                      # Configuración de WebdriverIO/Appium
└── package.json
```

### Patrón Page Object Model

Cada pantalla de la app se modela como una clase (`LoginPage`, `SignupPage`) que
hereda de una `Page` base con los helpers comunes (esperar, escribir, tocar). Los
selectores viven dentro de los page objects; los step definitions solo orquestan
acciones y hacen las aserciones. Así el código queda estructurado y mantenible.

### Selectores (confirmados desde el APK)

- **Login (`LoginActivity`)**: `input_email`, `input_password`, `btn_login`, `link_signup`
- **Signup (`SignupActivity`)**: `input_name`, `input_address`, `input_email`,
  `input_mobile`, `input_password`, `input_reEnterPassword`, `btn_signup`, `link_login`
- **Package**: `com.sourcey.materialloginexample`

## Requisitos previos

- Node.js 18+ y npm
- Java JDK 8+ (requerido por Appium/UiAutomator2)
- Android SDK + `adb` en el `PATH` (variable `ANDROID_HOME` configurada)
- Un emulador Android en ejecución o un dispositivo físico con depuración USB activada
- Appium 2 (se instala como dependencia del proyecto)

## Instalación

```bash
cd ui-automation
npm install

# Instalar el driver de Android para Appium (si no se instaló con npm install)
npx appium driver install uiautomator2
```

## Preparar un dispositivo/emulador

```bash
# Ver dispositivos disponibles
adb devices

# (opcional) arrancar un emulador ya creado
emulator -avd <nombre_del_avd>
```

## Ejecutar las pruebas

```bash
# Todos los escenarios
npm test

# Solo login
npm run test:login

# Solo registro
npm run test:signup
```

WebdriverIO arranca Appium automáticamente (via `@wdio/appium-service`), instala el
APK y ejecuta los escenarios de Cucumber.

### Variables de entorno útiles

| Variable           | Descripción                                  | Por defecto                          |
| ------------------ | -------------------------------------------- | ------------------------------------ |
| `APK_PATH`         | Ruta alternativa al APK                      | `./app/MaterialLoginExample.apk`     |
| `DEVICE_NAME`      | Nombre del dispositivo/emulador              | `Android Emulator`                   |
| `PLATFORM_VERSION` | Versión de Android objetivo                  | (autodetect)                         |

## Casos de prueba y aserciones

Cada caso incluye **como mínimo 2 aserciones**:

**Login**
- El formulario de login muestra el campo de email y el botón de login.
- Tras enviar el formulario, el botón sigue presente y la pantalla sigue interactiva.
- Navegación de login a signup muestra el formulario y el botón de registro.

**Registro**
- El formulario de registro muestra el campo de nombre y el botón de registro.
- Tras registrar, el formulario fue enviado y seguimos dentro del package de la app.

## CI/CD

El pipeline en `.github/workflows/ui-tests.yml` levanta un emulador Android en
GitHub Actions (`reactivecircus/android-emulator-runner`), instala dependencias y
ejecuta `npm test` en cada push y pull request a `main`/`master`.
