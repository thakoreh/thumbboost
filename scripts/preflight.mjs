import nextEnv from "@next/env";
import { evaluateProductionHealth } from "../src/lib/production-health.ts";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const health = evaluateProductionHealth(process.env, { strictProduction: true });

if (health.ok) {
  console.log("ThumbBoost production preflight passed.");
  if (health.missingOptional.length > 0) {
    console.log(`Optional env not set: ${health.missingOptional.join(", ")}`);
  }
  process.exit(0);
}

console.error("ThumbBoost production preflight failed.");
if (health.missingRequired.length > 0) {
  console.error(`Missing required env: ${health.missingRequired.join(", ")}`);
}
if (health.invalidRequired.length > 0) {
  console.error(`Invalid production env: ${health.invalidRequired.join("; ")}`);
}
if (health.missingOptional.length > 0) {
  console.error(`Optional env not set: ${health.missingOptional.join(", ")}`);
}
process.exit(1);
