const CANONICAL_HOST = 'aiviewer.ai';

/**
 * Keep every public URL on one canonical hostname.
 *
 * Cloudflare Pages `_redirects` rules match paths, not hostnames, so this
 * edge middleware is the repository-controlled enforcement point for the
 * www alias. The path and query string are preserved exactly.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 308);
  }

  return context.next();
}
