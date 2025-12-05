import express from 'express';
import cors from 'cors';
import postRoutes from './routes/posts'; // <--- 1. Імпорт

const app = express();

app.use(cors());
app.use(express.json());

// Тут будуть твої роути пізніше
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/posts', postRoutes);

export default app;