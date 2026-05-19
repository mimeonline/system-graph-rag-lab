import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const legacyRoutes: Record<string, string> = {
  "/about": `/${defaultLocale}/about`,
  "/blog": `/${defaultLocale}/essay`,
  "/datenschutz": `/${defaultLocale}/datenschutz`,
  "/demo": `/${defaultLocale}/demo`,
  "/essay": `/${defaultLocale}/essay`,
  "/impressum": `/${defaultLocale}/impressum`,
  "/story/graphrag": `/${defaultLocale}/story/graphrag`,
};

function permanentRedirect(request: NextRequest, pathname: string): NextResponse {
  return NextResponse.redirect(new URL(pathname, request.url), 308);
}

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return permanentRedirect(request, `/${defaultLocale}`);
  }

  const legacyTarget = legacyRoutes[pathname];
  if (legacyTarget) {
    return permanentRedirect(request, legacyTarget);
  }

  if (pathname.startsWith("/blog/")) {
    return permanentRedirect(request, `/${defaultLocale}/essay/${pathname.slice("/blog/".length)}`);
  }

  if (pathname.startsWith("/essay/")) {
    return permanentRedirect(request, `/${defaultLocale}/essay/${pathname.slice("/essay/".length)}`);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
