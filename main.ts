// Charm the Commuter — make.fun one-liner entry.
// One weather forecast for a city that does not exist, written to make a
// bored commuter smile on the way to work. The program is deterministic:
// no network, no randomness, no model calls, Node 22+ stdlib only.
//
// It writes the chosen line to <OUTPUT_DIR>/entry.txt (default /output),
// with NO trailing newline, so the file holds exactly the forecast line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// Winner from CANDIDATES.md (12 lines scored 20/20): Snoozeburg names the
// sleepy fictional city up front, forecasts impossible weather in real
// forecast language ("expect scattered naps", "90% chance"), and stacks
// three commuter payoffs — a seat, snoring clouds, coffee.
const FORECAST =
  "In Snoozeburg, expect scattered naps with a 90% chance of finding a seat — the clouds are snoring, so bring coffee.";

const LIMIT = 140;

function abort(reason: string): never {
  console.error(`charm-the-commuter: ${reason}`);
  process.exit(1);
}

function validate(line: string): number {
  if (line.length === 0) abort("forecast line is empty");
  if (line.trim() !== line) {
    abort("forecast line has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    abort("forecast line must be a single line");
  }
  // Code points, so an em dash counts as one character.
  const chars = [...line].length;
  if (chars > LIMIT) {
    abort(`forecast line is ${chars} characters, over the ${LIMIT} limit`);
  }
  return chars;
}

function run(): void {
  const chars = validate(FORECAST);
  const dir = resolve(process.env.OUTPUT_DIR ?? "/output");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  // Deliberately no trailing newline: entry.txt must be exactly the line.
  writeFileSync(file, FORECAST, "utf8");
  // Read it back and confirm the file holds exactly the forecast line:
  // same text, no trailing newline, valid UTF-8, within the 1-140 gate.
  const back = readFileSync(file, "utf8");
  if (back !== FORECAST) {
    abort("entry.txt read-back does not match the forecast line");
  }
  if (back.endsWith("\n")) abort("entry.txt has a trailing newline");
  console.log(`wrote ${chars}-character forecast to ${file}`);
}

run();
