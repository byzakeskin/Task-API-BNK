require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');
const setupSwagger = require('./src/swagger');

const app = express();

// ── Middleware ─────────────────────────────────────────────────
app.use(cors()); // Frontend'in farklı porttan istek atabilmesi için
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Statik frontend dosyalarını sun ───────────────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Veritabanı ────────────────────────────────────────────────
connectDB();

// ── Swagger ───────────────────────────────────────────────────
setupSwagger(app);

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/tasks', require('./src/routes/taskRoutes'));

// ── Frontend'i serve et (tüm diğer route'lar index.html'e döner)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Sunucu hatası', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu: http://localhost:${PORT}`);
  console.log(`📋 Frontend: http://localhost:${PORT}`);
});
