// Runs the test suite and appends a one-line summary to test-results/HISTORY.md.
// Usage: npm run test:record [-- "label"]   e.g. npm run test:record -- "slice 1"
import { spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const label = process.argv.slice(2).join(" ").trim() || "-";
const dir = "test-results";
const json = `${dir}/latest.json`;
const history = `${dir}/HISTORY.md`;

mkdirSync(dir, { recursive: true });

const run = spawnSync(
  "npx",
  ["vitest", "run", "--reporter=default", "--reporter=json", `--outputFile=${json}`],
  { stdio: "inherit", shell: process.platform === "win32" },
);

let passed = 0, failed = 0, total = 0, failures = [];
try {
  const r = JSON.parse(readFileSync(json, "utf8"));
  passed = r.numPassedTests;
  failed = r.numFailedTests;
  total = r.numTotalTests;
  failures = r.testResults
    .flatMap((f) => f.assertionResults)
    .filter((a) => a.status === "failed")
    .map((a) => a.fullName);
} catch {
  failures = ["(no JSON report: the test run crashed before reporting)"];
  failed = failed || 1;
}

const sha = spawnSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).stdout?.trim() || "no-commit";
const when = new Date().toISOString().slice(0, 16).replace("T", " ");
const status = failed === 0 && run.status === 0 ? "PASS" : "FAIL";
const note = failures.length ? failures.slice(0, 3).join("; ").replace(/\|/g, "/") : "";

if (!existsSync(history)) {
  writeFileSync(history, "# Test history\n\n| When (UTC) | Label | Commit | Result | Passed | Failed | Total | Failing tests |\n|---|---|---|---|---|---|---|---|\n");
}
appendFileSync(history, `| ${when} | ${label} | ${sha} | ${status} | ${passed} | ${failed} | ${total} | ${note} |\n`);

console.log(`\nRecorded: ${status} ${passed}/${total} → ${history}`);
process.exit(run.status ?? 1);
