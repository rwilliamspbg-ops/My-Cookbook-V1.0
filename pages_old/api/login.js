export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password } = req.body || {};

  // TODO: replace with real user lookup & password check
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // For now, accept any credentials and “log in”
  // In a real app you’d set a cookie / JWT here
  return res.status(200).json({ ok: true });
}

