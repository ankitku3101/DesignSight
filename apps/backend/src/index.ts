import express from 'express';
import cors from 'cors'; 
import screenRoutes from './routes/screenRoutes';
import projectRoutes from './routes/projectRoutes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('Google credentials path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Middleware
app.use(cors()); // 👈 enable CORS for all origins
app.use(express.json());
app.use(express.text()); // 👈 also allow text payloads if needed

// Serve uploaded images
const UPLOAD_DIR = path.join(__dirname, './uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Routes
app.use('/api', screenRoutes);
app.use('/api', projectRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/designsight';

mongoose
  .connect(MONGO_URI, { dbName: 'designsight' })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
