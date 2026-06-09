const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://moddy-notes-mgyg.vercel.app',
      'http://localhost:5173',
      'https://moddynotes.onrender.com',
    ];
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'ModdyNotes API is running!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ModdyNotes API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ModdyNotes server running on port ${PORT}`);
});
const cors = require('cors');
app.use(cors({
  origin: 'https://moddy-notes-mgyg-kl8tty02w-parikshit-shahs-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));