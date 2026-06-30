require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const { attachUserIfPresent, authRequired } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/session', attachUserIfPresent, (req, res) => {
  res.json({ loggedIn: !!req.user, username: req.user?.username || null });
});

app.get('/dashboard', authRequired, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Public profile page — must come after static & API routes
app.get('/:username', (req, res, next) => {
  if (req.params.username.startsWith('api') || req.params.username.includes('.')) return next();
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Biolink platform running at http://localhost:${PORT}`);
});
