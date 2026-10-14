const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = __dirname;
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(rootDir, 'data');
const submissionsFile = path.join(dataDir, 'submissions.json');

function ensureDataStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(submissionsFile)) {
    fs.writeFileSync(submissionsFile, '[]', 'utf8');
  }
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(publicDir, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(publicDir, 'contact.html'));
});

app.post('/api/contact', (req, res) => {
  const submission = req.body || {};
  const name = (submission.name || '').trim();
  const email = (submission.email || '').trim();
  const interest = (submission.interest || '').trim();
  const message = (submission.message || '').trim();
  const subject = (submission._subject || '').trim();
  const captcha = submission._captcha;

  const errors = [];

  if (!name) {
    errors.push('Name is required.');
  }

  if (!email) {
    errors.push('Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!message) {
    errors.push('Message is required.');
  } else if (message.length < 10) {
    errors.push('Message must be at least 10 characters long.');
  }

  if (subject && subject.toLowerCase() !== 'site verification') {
    errors.push('Submission subject is invalid.');
  }

  if (captcha !== undefined && captcha !== false && captcha !== 'false') {
    errors.push('Captcha verification failed.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Please correct the highlighted issues and try again.',
      errors,
    });
  }

  try {
    const existing = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      email,
      interest,
      message,
      createdAt: new Date().toISOString(),
    };

    const updated = Array.isArray(existing) ? [...existing, entry] : [entry];
    fs.writeFileSync(submissionsFile, JSON.stringify(updated, null, 2));

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received successfully.',
      submission: entry,
    });
  } catch (error) {
    console.error('Failed to save submission:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while saving your message. Please try again later.',
      errors: ['Unable to save your submission at this time.'],
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

ensureDataStore();

app.listen(PORT, () => {
  console.log(`Proxxy server running on http://localhost:${PORT}`);
});
