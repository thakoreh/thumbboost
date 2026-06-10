export function generationButtonLabel(elapsedSeconds: number) {
  if (elapsedSeconds >= 45) return "Finalizing preview...";
  if (elapsedSeconds >= 25) return "Rendering image...";
  if (elapsedSeconds >= 10) return "Composing thumbnail...";
  return "Queued generation...";
}

export function generationProgressNotice(elapsedSeconds: number) {
  if (elapsedSeconds >= 40) return "Still rendering the image. This can take about a minute on the live model.";
  if (elapsedSeconds >= 12) return "Live image generation usually takes 45-70 seconds. Keep this tab open.";
  return null;
}
