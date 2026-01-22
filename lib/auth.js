export function parseUserFromRequest(cookiesOrReq) {
  let cookieHeader;

  // Next.js cookies() object: has getAll()
  if (cookiesOrReq && typeof cookiesOrReq.getAll === 'function') {
    cookieHeader = cookiesOrReq
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
  } else if (cookiesOrReq && cookiesOrReq.headers) {
    // Traditional request-like object
    cookieHeader = cookiesOrReq.headers.cookie;
  }

  // TODO: your existing logic that parses user from cookieHeader.
  // Example stub:
  if (!cookieHeader) return null;

  // Replace this with your real parsing code
  // e.g. decode session, JWT, etc.
  return { id: 1 }; // placeholder
}

