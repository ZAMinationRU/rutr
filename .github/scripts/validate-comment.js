import fs from "fs";
import path from "path";
import core from "@actions/core";
import github from "@actions/github";

const localesDir = path.join(process.cwd(), "locales");
const languagesPath = path.join(process.cwd(), "Languages.json");

const prNumber = github.context.payload.pull_request?.number;
const repo = github.context.repo.repo;
const owner = github.context.repo.owner;

// Load Languages.json
let languages;
try {
  languages = JSON.parse(fs.readFileSync(languagesPath, "utf8"));
} catch (e) {
  core.setFailed("❌ Could not read Languages.json");
  process.exit(1);
}

// Collect all translation files
const files = fs.readdirSync(localesDir).filter(f => f.endsWith(".json"));

const messages = [];

// Ensure each file has an entry in Languages.json
for (const file of files) {
  const langTag = path.basename(file, ".json");
  if (!languages[langTag]) {
    messages.push(`❌ Missing entry for '${langTag}' in Languages.json`);
  }
}

// Ensure en.json exists
if (!files.includes("en.json")) {
  messages.push("❌ Missing en.json (base language).");
}

// Load en.json as base
const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en.json"), "utf8"));
const enKeys = Object.keys(en);

// Validate each language file
for (const file of files) {
  if (file === "en.json") continue;

  const langTag = path.basename(file, ".json");
  const data = JSON.parse(fs.readFileSync(path.join(localesDir, file), "utf8"));
  const keys = Object.keys(data);

  const missing = enKeys.filter(k => !keys.includes(k));
  const extra = keys.filter(k => !enKeys.includes(k));

  if (missing.length > 0) messages.push(`❌ ${langTag}.json is missing keys: ${missing.join(", ")}`);
  if (extra.length > 0) messages.push(`❌ ${langTag}.json has extra keys: ${extra.join(", ")}`);
}

// Post a comment on the PR if any issues found
if (prNumber && messages.length > 0) {
  const token = process.env.GITHUB_TOKEN;
  const octokit = github.getOctokit(token);

  const body = `### Translation Validation Results\n${messages.join("\n")}`;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  });

  core.setFailed("❌ Translation validation failed. See PR comment for details.");
} else if (messages.length === 0) {
  console.log("✅ All translations validated successfully.");
}
