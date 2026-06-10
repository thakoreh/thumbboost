import test from "node:test";
import assert from "node:assert/strict";
import { generationButtonLabel, generationProgressNotice } from "../src/lib/generation-status.ts";

test("generation button label reflects long-running image generation", () => {
  assert.equal(generationButtonLabel(0), "Queued generation...");
  assert.equal(generationButtonLabel(12), "Composing thumbnail...");
  assert.equal(generationButtonLabel(30), "Rendering image...");
  assert.equal(generationButtonLabel(50), "Finalizing preview...");
});

test("generation progress notice sets expectation after the initial wait", () => {
  assert.equal(generationProgressNotice(0), null);
  assert.equal(generationProgressNotice(10), null);
  assert.equal(generationProgressNotice(12), "Live image generation usually takes 45-70 seconds. Keep this tab open.");
  assert.equal(generationProgressNotice(45), "Still rendering the image. This can take about a minute on the live model.");
});
