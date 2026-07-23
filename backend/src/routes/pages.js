const express = require('express');
const db = require('../config/db');
const protectRoute = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await db.query('SELECT * FROM pages WHERE slug = $1', [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protectRoute, async (req, res) => {
  try {
    const { title, slug, blocks } = req.body;

    const blocksJson = JSON.stringify(blocks || []);

    const queryText = `
      INSERT INTO pages (title, slug, blocks, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET 
        title = EXCLUDED.title,
        blocks = EXCLUDED.blocks,
        updated_at = NOW()
      RETURNING *;
    `;

    const result = await db.query(queryText, [title, slug, blocksJson]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;