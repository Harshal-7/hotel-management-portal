import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';

import './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('etag');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Prevent caching of API responses (no store, no cache, no etag)
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Hotel Admin API', methods: ['GET', 'POST', 'PUT', 'DELETE'] });
});

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('API: GET/POST /api/auth, GET/POST/PUT/DELETE /api/hotels');
});
