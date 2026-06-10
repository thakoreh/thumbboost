type OriginRequest = {
  headers: {
    get(name: string): string | null;
  };
  nextUrl: {
    host: string;
  };
};

type OriginEnv = Record<string, string | undefined>;

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || undefined;
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function canonicalAppOrigin(value?: string | null) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || isLocalHost(url.hostname)) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function publicOrigin(request: OriginRequest, env: OriginEnv = process.env) {
  const configured = canonicalAppOrigin(env.NEXT_PUBLIC_APP_URL);
  if (configured) return configured;

  const host = firstHeaderValue(request.headers.get("x-forwarded-host")) || request.headers.get("host") || request.nextUrl.host;
  const forwardedProto = firstHeaderValue(request.headers.get("x-forwarded-proto"));
  const proto = forwardedProto === "https" || forwardedProto === "http" ? forwardedProto : host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}
