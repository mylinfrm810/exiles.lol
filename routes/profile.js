const express = require('express');
const db = require('../db/database');
const { authRequired } = require('../auth');
const { avatarUpload, backgroundUpload, audioUpload } = require('../upload');
const fetch = require('node-fetch');

const router = express.Router();

const PUBLIC_FIELDS = `id, username, display_name, bio, avatar_url, background_url,
  background_type, audio_url, cursor_effect, accent_color, discord_id, view_count`;

// Get my own profile (for dashboard)
router.get('/me', authRequired, (req, res) => {
  const user = db.prepare(`SELECT ${PUBLIC_FIELDS}, email FROM users WHERE id = ?`).get(req.user.id);
  const links = db.prepare('SELECT id, platform, url FROM links WHERE user_id = ? ORDER BY sort_order ASC').all(req.user.id);
  res.json({ user, links });
});

// Update profile fields
router.put('/me', authRequired, (req, res) => {
  const { display_name, bio, cursor_effect, accent_color, background_type, discord_id } = req.body;
  db.prepare(`
    UPDATE users SET
      display_name = COALESCE(?, display_name),
      bio = COALESCE(?, bio),
      cursor_effect = COALESCE(?, cursor_effect),
      accent_color = COALESCE(?, accent_color),
      background_type = COALESCE(?, background_type),
      discord_id = COALESCE(?, discord_id)
    WHERE id = ?
  `).run(display_name, bio, cursor_effect, accent_color, background_type, discord_id, req.user.id);
  res.json({ success: true });
});

router.post('/me/avatar', authRequired, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/avatars/${req.file.filename}`;
  db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(url, req.user.id);
  res.json({ success: true, url });
});

router.post('/me/background', authRequired, backgroundUpload.single('background'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/backgrounds/${req.file.filename}`;
  const type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  db.prepare('UPDATE users SET background_url = ?, background_type = ? WHERE id = ?').run(url, type, req.user.id);
  res.json({ success: true, url, type });
});

router.post('/me/audio', authRequired, audioUpload.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/audio/${req.file.filename}`;
  db.prepare('UPDATE users SET audio_url = ? WHERE id = ?').run(url, req.user.id);
  res.json({ success: true, url });
});

// Links CRUD
router.post('/me/links', authRequired, (req, res) => {
  const { platform, url } = req.body;
  if (!platform || !url) return res.status(400).json({ error: 'Missing platform or url' });
  const count = db.prepare('SELECT COUNT(*) as c FROM links WHERE user_id = ?').get(req.user.id).c;
  if (count >= 12) return res.status(400).json({ error: 'Max 12 links' });
  const info = db.prepare('INSERT INTO links (user_id, platform, url, sort_order) VALUES (?, ?, ?, ?)')
    .run(req.user.id, platform, url, count);
  res.json({ success: true, id: info.lastInsertRowid });
});

router.delete('/me/links/:id', authRequired, (req, res) => {
  db.prepare('DELETE FROM links WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Public profile fetch (JSON, used by the profile page renderer)
router.get('/public/:username', (req, res) => {
  const user = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE username = ?`).get(req.params.username);
  if (!user) return res.status(404).json({ error: 'Not found' });

  db.prepare('UPDATE users SET view_count = view_count + 1 WHERE id = ?').run(user.id);
  user.view_count += 1;

  const links = db.prepare('SELECT platform, url FROM links WHERE user_id = ? ORDER BY sort_order ASC').all(user.id);
  res.json({ user, links });
});

// Discord presence proxy (uses the public Lanyard API; user must join the Lanyard support server)
router.get('/discord/:discordId', async (req, res) => {
  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${req.params.discordId}`);
    const data = await r.json();
    if (!data.success) return res.status(404).json({ error: 'Not found on Lanyard. User must join the Lanyard Discord server.' });
    res.json(data.data);
  } catch (e) {
    res.status(500).json({ error: 'Could not reach Discord presence service' });
  }
});

module.exports = router;
