const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pageRoutes = require('./routes/pages');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));