import { validateCredentials } from '../services/authService.js';

export function login(req, res) {
  const { username, password } = req.body || {};
  if (validateCredentials(username, password)) {
    res.cookie('session', 'logged_in', {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
    return res.status(200).json({ success: true });
  }
  res.status(401).json({ error: 'Invalid credentials' });
}

export function logout(req, res) {
  res.clearCookie('session');
  res.status(200).json({ success: true });
}
