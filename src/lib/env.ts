export function runtimeEnv(key: string, env: Record<string, string | undefined> = process.env) {
  const value = env[key];
  return value?.trim() ? value : undefined;
}

export function serverConvexUrl() {
  return runtimeEnv("CONVEX_URL") ?? runtimeEnv("NEXT_PUBLIC_CONVEX_URL");
}
