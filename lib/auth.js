import jwt from 'jsonwebtoken';

const AUTH_COOKIE = 'mc_auth';

export function parseUserFromRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...rest] = c.trim().split('=');
      return [k, decodeURIComponent(rest.join('='))];
    })
  );

  const token = cookies[AUTH_COOKIE];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return payload; // { id, email, role }
  } catch {
    return null;
  }
}
