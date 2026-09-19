import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SCREENSHOTS_DIR = join(process.cwd(), 'screenshots');

// Per-scenario step counter so screenshots sort in execution order.
let scenarioSlug = 'scenario';
let stepIndex = 0;

/**
 * Called from the Before hook to start a fresh, ordered set of screenshots
 * for the current scenario.
 */
export function startScenarioShots(name) {
  scenarioSlug = slug(name);
  stepIndex = 0;
}

/**
 * Capture a numbered screenshot for the current scenario step.
 * File: screenshots/<scenario>__NN_<label>.png
 */
export async function snap(label) {
  try {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    stepIndex += 1;
    const n = String(stepIndex).padStart(2, '0');
    const file = join(SCREENSHOTS_DIR, `${scenarioSlug}__${n}_${slug(label)}.png`);
    await driver.saveScreenshot(file);
  } catch {
    // Never let screenshot capture fail a step.
  }
}

/**
 * Capture a final PASSED/FAILED screenshot for the whole scenario.
 */
export async function snapResult(status, name) {
  try {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    const file = join(SCREENSHOTS_DIR, `${String(status).toUpperCase()}_${slug(name)}.png`);
    await driver.saveScreenshot(file);
  } catch {
    // ignore
  }
}

function slug(text) {
  return String(text || 'x')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}
