const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    return res.json({ success: true, token });
  }
  
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;