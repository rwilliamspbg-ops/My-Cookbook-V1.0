// pages/api/login.js
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const AUTH_COOKIE = 'mc_auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // TODO: validate password and load user from DB
  const fakeUser = { id: 1, email, role: 'admin' };

  const token = jwt.sign(fakeUser, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '7d',
  });

  res.setHeader(
    'Set-Cookie',
    cookie.serialize(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })
  );

  return res.status(200).json({ ok: true });
}
