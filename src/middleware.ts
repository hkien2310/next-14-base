import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./lib/i18nNavigation";
import type { Auth } from "./interfaces/auth.interface";
import { JWT_AUTH } from "./constants/common";
import { isEmpty } from "lodash";
import { AppConfig } from "./utils/appConfig";
import urls from "./constants/urls";

const intlMiddleware = createMiddleware(routing);

const protectedPages = [urls.Admin.Dashboard, urls.User.Dashboard];

const authPages = [urls.SignIn, urls.SignUp];

export default async function middleware(
  request: NextRequest
  // event: NextFetchEvent,
) {
  const auth = JSON.parse(request.cookies.get(JWT_AUTH)?.value || "{}") as Auth;
  const isLogged = !isEmpty(auth);

  // Extract the URL pathname from the request
  const path = request.nextUrl.pathname;

  const isAdminPage = request.nextUrl.pathname.includes("/admin");

  const regexCheckIsAuthPage = new RegExp(
    `^(/(${AppConfig.locales.join("|")}))?(${authPages.join("|")})/?$`,
    "i"
  );
  const regexCheckIsProtectedPage = new RegExp(
    `^(/(${AppConfig.locales.join("|")}))?(${protectedPages.join("|")})/?$`,
    "i"
  );

  // If user have not logged in yet -> access to protected page -> redirect to sign-in
  if (!isLogged && regexCheckIsProtectedPage.test(path)) {
    return NextResponse.redirect(new URL(urls.SignIn, request.url));
  }

  // If user logged in -> access sign-in / sign-up -> redirect to homepage
  if (isLogged && regexCheckIsAuthPage.test(path)) {
    if (auth.role === "admin") {
      return NextResponse.redirect(new URL(urls.Admin.Dashboard, request.url));
    } else if (auth.role === "user") {
      return NextResponse.redirect(new URL(urls.User.Dashboard, request.url));
    } else {
      return NextResponse.redirect(new URL(urls.Homepage, request.url));
    }
  }

  if (isAdminPage && auth.role !== "admin") {
    return NextResponse.redirect(new URL(urls.User.Dashboard, request.url));
  }

  // Allow direct access to sitemap.xml and robots.txt without i18n middleware processing
  // This ensures these files are properly served for SEO purposes
  // Related to GitHub issue: https://github.com/ixartz/Next-js-Boilerplate/issues/356
  if (path === "/sitemap.xml" || path === "/robots.txt") {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|monitoring|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
