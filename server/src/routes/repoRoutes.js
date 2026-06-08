import express from 'express';
import axios from 'axios';
import Repo from '../models/Repo.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/github', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: { Authorization: `Bearer ${req.user.accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

router.get('/connected', authMiddleware, async (req, res) => {
  try {
    const repos = await Repo.find({ userId: req.user._id });
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch connected repos' });
  }
});

router.post('/connect', authMiddleware, async (req, res) => {
  const { githubId, name, fullName, owner, url } = req.body;
  try {
    const repo = await Repo.findOneAndUpdate(
      { userId: req.user._id, githubId },
      { name, fullName, owner, url, userId: req.user._id },
      { upsert: true, new: true }
    );
    res.json(repo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect repository' });
  }
});

router.delete('/:githubId', authMiddleware, async (req, res) => {
  try {
    await Repo.findOneAndDelete({ userId: req.user._id, githubId: req.params.githubId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disconnect repository' });
  }
});

export default router;
