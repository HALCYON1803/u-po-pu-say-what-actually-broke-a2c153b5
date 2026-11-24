// Say What Actually Broke — one line of honest error copy.
//
// The whole entry is a single sentence. This program writes exactly that
// sentence — and nothing else — to /output/entry.txt, then reads the file
// back and refuses to exit cleanly unless every byte matches the line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "A typo we shipped just took down the login page. Refresh in a minute — the typo has been fired.";
// The line names the real failure in plain words (a shipped typo took down
// login), tells the reader what to do next (refresh in a minute), and lands
// the joke with a twist the reader repeats out loud (the typo got fired).
// 95 characters, 97 bytes (the em dash is 3 bytes in UTF-8), one line.
const EXPECTED_CHARS = 95;
const EXPECTED_BYTES = 97;
const OUT_PATH = "/output/entry.txt";

function fail(reason: string): never {
  console.error(`self-check failed: ${reason}`);
  process.exit(1);
}

function main(): void {
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, LINE, "utf8");

  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== LINE) fail("file content differs from the line");
  if ([...written].length !== EXPECTED_CHARS) {
    fail(`expected ${EXPECTED_CHARS} characters, got ${[...written].length}`);
  }
  if (written.trim() !== written) fail("leading or trailing whitespace found");
  if (written.endsWith("\n")) fail("trailing newline found");
  if (written.split("\n").length !== 1) fail("more than one line found");

  const bytes = Buffer.byteLength(written, "utf8");
  if (bytes !== EXPECTED_BYTES) {
    fail(`expected ${EXPECTED_BYTES} bytes, got ${bytes}`);
  }
  console.log(`ok: ${bytes} bytes, ${EXPECTED_CHARS} chars, 1 line, no trailing newline -> ${OUT_PATH}`);
}

main();
