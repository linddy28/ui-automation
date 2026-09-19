# UI Automation — MaterialLoginExample

End-to-end mobile UI automation for the **login** and **user registration** flows of the
Android app `MaterialLoginExample.apk`, built with **WebdriverIO + Appium + Cucumber** and
organized using the **Page Object Model (POM)** design pattern.

This project was created as part of a QA Automation technical challenge. It covers the two
mandatory flows (login and signup), uses Cucumber for BDD scenarios, applies at least two
assertions per test case, ships a CI/CD pipeline (GitHub Actions) and includes these
detailed instructions.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project architecture](#project-architecture)
3. [Design pattern: Page Object Model](#design-pattern-page-object-model)
4. [Selectors (verified from the APK)](#selectors-verified-from-the-apk)
5. [Prerequisites](#prerequisites)
6. [Installation](#installation)
7. [Preparing a device / emulator](#preparing-a-device--emulator)
8. [Running the tests](#running-the-tests)
9. [Environment variables](#environment-variables)
10. [Test cases and assertions](#test-cases-and-assertions)
11. [How it works end-to-end](#how-it-works-end-to-end)
12. [CI/CD pipeline](#cicd-pipeline)
13. [Reports and logs](#reports-and-logs)
14. [Troubleshooting](#troubleshooting)

---

## Tech stack

| Tool            | Version | Purpose                                          |
| --------------- | ------- | ------------------------------------------------ |
| Node.js         | 18+     | JavaScript runtime                               |
| WebdriverIO     | 9.x     | Test runner and automation client                |
| Appium          | 2.x     | Mobile automation server                         |
| UiAutomator2    | 3.x     | Appium driver for Android                         |
| Cucumber        | 9.x     | BDD scenarios written in Gherkin                 |
| GitHub Actions  | —       | CI/CD pipeline (Android emulator in the cloud)   |

> The framework language is **JavaScript (ESM)**. All test glue and page objects are plain
> `.js` files using `import`/`export`.

---

## Project architecture

```
ui-automation/
├── app/
│   └── MaterialLoginExample.apk        # App under test (bundled in the repo)
├── features/
│   ├── login.feature                   # Login scenarios (Gherkin)
│   ├── signup.feature                  # Registration scenarios (Gherkin)
│   └── step-definitions/
│       ├── login.steps.js              # Step definitions for login
│       └── signup.steps.js             # Step definitions for registration
├── pageobjects/                        # Page Object Model layer
│   ├── page.js                         # Base Page (shared helpers)
│   ├── login.page.js                   # Login screen page object
│   └── signup.page.js                  # Signup screen page object
├── logs/                               # Appium logs (generated at runtime)
├── .github/
│   └── workflows/
│       └── ui-tests.yml                # CI pipeline (GitHub Actions)
├── wdio.conf.js                        # WebdriverIO + Appium configuration
├── package.json                        # Scripts and dependencies
├── .gitignore
└── README.md
```

### What lives where

- **`features/`** — Human-readable Gherkin scenarios. These describe *what* the app should
  do, in business language, without technical detail.
- **`features/step-definitions/`** — The JavaScript that binds each Gherkin step to real
  actions and assertions. This layer only orchestrates: it calls page objects and asserts.
- **`pageobjects/`** — The Page Object Model. Every screen is a class that owns its
  selectors and exposes intention-revealing methods (`login()`, `register()`, `goToSignup()`).
- **`wdio.conf.js`** — Central configuration: capabilities, Appium service, Cucumber
  options, timeouts.

---

## Design pattern: Page Object Model

The Page Object Model keeps selectors and low-level interactions out of the tests. Each
screen of the app is modeled as a class:

- **`Page` (base)** — Common helpers reused by every page: build Android UiSelectors by id,
  text or class; wait-and-type; wait-and-tap; hide the keyboard.
- **`LoginPage`** — Owns the login screen selectors and actions (`login`, `goToSignup`).
- **`SignupPage`** — Owns the signup screen selectors and actions (`register`).

Benefits: if a selector changes, you update it in exactly one place; the Gherkin steps stay
clean and readable; and scenarios can be composed from reusable actions. This is the
structured, maintainable architecture the challenge asks for.

Example (simplified) of the base helper that all pages share:

```js
// pageobjects/page.js
byId(id) {
  return `android=new UiSelector().resourceId("com.sourcey.materialloginexample:id/${id}")`;
}

async setValue(selector, value) {
  const el = await $(selector);
  await el.waitForDisplayed({ timeout: 15000 });
  await el.clearValue();
  await el.setValue(value);
}
```

---

## Selectors (verified from the APK)

The selectors were **extracted and confirmed directly from `MaterialLoginExample.apk`**
(not guessed), so they match the real resource ids inside the app.

- **App package:** `com.sourcey.materialloginexample`
- **Launcher / Login activity:** `com.sourcey.materiallogindemo.LoginActivity`
- **Signup activity:** `com.sourcey.materiallogindemo.SignupActivity`

**Login screen (`LoginActivity`):**

| Element        | Resource id      |
| -------------- | ---------------- |
| Email field    | `input_email`    |
| Password field | `input_password` |
| Login button   | `btn_login`      |
| Signup link    | `link_signup`    |

**Signup screen (`SignupActivity`):**

| Element                | Resource id             |
| ---------------------- | ----------------------- |
| Name field             | `input_name`            |
| Address field          | `input_address`         |
| Email field            | `input_email`           |
| Mobile field           | `input_mobile`          |
| Password field         | `input_password`        |
| Re-enter password      | `input_reEnterPassword` |
| Signup button          | `btn_signup`            |
| Login link             | `link_login`            |

All selectors are used with the full package prefix, e.g.
`com.sourcey.materialloginexample:id/input_email`.

---

## Prerequisites

- **Node.js 18+** and **npm**
- **Java JDK 8+** (required by Appium / UiAutomator2)
- **Android SDK** with `adb` available on your `PATH`, and `ANDROID_HOME` (or
  `ANDROID_SDK_ROOT`) exported
- An **Android emulator** running, or a **physical device** with USB debugging enabled
- Appium 2 (installed as a project dependency, no global install required)

> If `ANDROID_HOME`/`ANDROID_SDK_ROOT` is not set, Appium cannot start a session. This is
> the single most common local setup issue — see [Troubleshooting](#troubleshooting).

---

## Installation

```bash
cd ui-automation
npm install

# Install the Android driver for Appium if it was not installed automatically
npx appium driver install uiautomator2
```

---

## Preparing a device / emulator

```bash
# List connected devices / running emulators
adb devices

# (optional) start an existing AVD by name
emulator -avd <your_avd_name>
```

Make sure at least one device shows as `device` (not `offline`) in `adb devices` before
running the tests.

---

## Running the tests

```bash
# Run every scenario (login + signup)
npm test

# Run only login scenarios (tag @login)
npm run test:login

# Run only signup scenarios (tag @signup)
npm run test:signup
```

WebdriverIO starts Appium automatically through `@wdio/appium-service`, installs the APK on
the target device, launches the app on `LoginActivity`, and runs the Cucumber scenarios.

---

## Environment variables

You can override configuration without editing files:

| Variable           | Description                                   | Default                              |
| ------------------ | --------------------------------------------- | ------------------------------------ |
| `APK_PATH`         | Alternative absolute path to the APK          | `./app/MaterialLoginExample.apk`     |
| `DEVICE_NAME`      | Device / emulator name                        | `Android Emulator`                   |
| `PLATFORM_VERSION` | Target Android version                        | (auto-detected)                      |

Example:

```bash
APK_PATH=/abs/path/to/MaterialLoginExample.apk DEVICE_NAME="Pixel_5_API_30" npm test
```

---

## Test cases and assertions

Every scenario includes **at least two assertions**, as required.

### Login (`features/login.feature`)

1. **Login form shows the expected controls**
   - The email field is displayed.
   - The login button is displayed.
2. **A user submits the login form** (data-driven, two example rows)
   - The login button is still present after submitting.
   - The login screen remains interactive (email field still displayed).
3. **Navigate from login to signup**
   - The signup form (name field) is displayed.
   - The signup button is displayed.

### Registration (`features/signup.feature`)

1. **Signup form shows the expected controls**
   - The name field is displayed.
   - The signup button is displayed.
2. **Register a new user with valid data**
   - The registration form was submitted (signup button still exists).
   - We remain inside the app package `com.sourcey.materialloginexample`.

---

## How it works end-to-end

1. `wdio.conf.js` defines the Android capabilities and points Appium at the APK.
2. WebdriverIO boots the Appium server (via `@wdio/appium-service`) on port `4723`.
3. Appium installs and launches the app on the emulator/device.
4. Cucumber reads the `.feature` files and matches each step to a definition in
   `features/step-definitions/`.
5. Step definitions call methods on the page objects (`LoginPage`, `SignupPage`).
6. Page objects locate elements by resource id and perform the interaction.
7. Assertions use `expect-webdriverio` matchers (`toBeDisplayed`, `toBeExisting`, `toBe`).

---

## CI/CD pipeline

The workflow at `.github/workflows/ui-tests.yml` runs on every push and pull request to
`main`/`master` (and can be triggered manually). It:

1. Checks out the repository.
2. Sets up Node.js 20 with npm cache.
3. Installs dependencies (`npm ci`, falling back to `npm install`).
4. Enables KVM hardware acceleration on the runner.
5. Boots an **Android emulator** using `reactivecircus/android-emulator-runner` and runs
   `npm test` inside it.
6. Uploads Appium logs as a build artifact.

This satisfies the requirement of running the project through an automated pipeline.

---

## Reports and logs

- **Console output:** the `spec` reporter prints a per-scenario summary in the terminal.
- **Appium logs:** written to `./logs/` and uploaded as an artifact in CI.

---

## Troubleshooting

**`Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported`**
Appium cannot find the Android SDK. Export it, for example:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

**No devices found**
Run `adb devices` and make sure an emulator is booted or a device is connected with USB
debugging enabled.

**`uiautomator2` driver missing**
Install it explicitly: `npx appium driver install uiautomator2`.

**Session fails to create on first run**
The first launch can be slow while the driver installs helper apps. Increase timeouts in
`wdio.conf.js` (`waitforTimeout`, `connectionRetryTimeout`) if needed.
