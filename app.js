import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import mongoose from './config/mongoConnection.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import skillsRouter from './routes/skills.js';
import profileRouter from './routes/profile.js';

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/skills', skillsRouter);
app.use('/profile', profileRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));