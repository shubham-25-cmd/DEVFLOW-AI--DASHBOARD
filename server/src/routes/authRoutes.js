import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

router.get('/github', (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user,workflow`;
  res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token',
      { client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );
    const { access_token } = tokenRes.data;
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    const githubUser = userRes.data;
    const user = await User.findOneAndUpdate(
      { githubId: githubUser.id },
      { username: githubUser.login, avatarUrl: githubUser.avatar_url, accessToken: access_token, email: githubUser.email },
      { upsert: true, new: true }
    );
    const token = createJWT({ userId: user._id });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect(process.env.FRONTEND_URL + '/dashboard');
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default router;