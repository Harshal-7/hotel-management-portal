export function requireAuth(req, res, next) {
  if (req.cookies?.session === 'logged_in') {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}
