// Content freeze guard for the approved motion-only change.
// These hashes were recorded from the local redesign, not the older Git HEAD.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const frozenFiles = [
  ["src/data/dino-site.ts", "80d36f0875c27a81e67bcf9eef4a438f677ddc3c4c2360abfc2562da9c5ac4b9"],
  ["src/data/dino-content.ts", "b5e447c3209b5fc18ba4ba28a51c8a9e98872bddcb538a41da2d8394e57e5b7e"],
  ["src/lib/booking.ts", "e1b0196fcd153341d4f5855eb32fe4fcfae0279f42d6e29aff4aca19179e4b80"]
];
for (const [path, expected] of frozenFiles) {
  test(`motion-only scope preserves ${path}`, () => {
    const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected);
  });
}
