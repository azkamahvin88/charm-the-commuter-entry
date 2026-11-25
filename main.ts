// Charm the Commuter — make.fun one-liner entry.
//
// Writes the chosen forecast line to <OUTPUT_DIR>/entry.txt (default
// /output). The line is a single weather forecast for a city that does
// not exist, written to make a bored commuter smile on the way to work.
//
// Guards: the line must be a single line of 1-140 characters (counted in
// code points, so emoji and accented letters count once each). Anything
// else fails loudly before any file is written.

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LINE =
  "In Snoozeburg, expect scattered naps with a 90% chance of finding a seat — the clouds are snoring, so bring coffee.";

const MAX_CHARS = 140;

function fail(message: string): never {
  console.error(`entry failed: ${message}`);
  process.exit(1);
}

function checkLine(line: string): void {
  const trimmed = line.trim();

  if (trimmed.length === 0) {
    fail("forecast line is empty");
  }
  if (trimmed !== line) {
    fail("forecast line has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("forecast line must be a single line (contains a newline)");
  }

  const size = [...line].length; // code points, not UTF-16 units
  if (size < 1 || size > MAX_CHARS) {
    fail(`forecast line is ${size} characters, must be 1-${MAX_CHARS}`);
  }
}

function main(): void {
  checkLine(LINE);

  const outDir = resolve(process.env.OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, `${LINE}\n`, "utf8");

  console.log(`wrote ${[...LINE].length}-character forecast to ${target}`);
}

main();
