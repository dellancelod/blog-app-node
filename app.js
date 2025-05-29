require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');

// DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Підключено до MongoDB"))
  .catch((err) => console.error("❌ Помилка MongoDB:", err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts); // підключення layout
app.set('layout', 'layout'); // назва твого layout-шаблону (layout.ejs в /views)

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Доступ до користувача та повідомлень у кожному шаблоні
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success')
  };
  next();
});

// Основні маршрути
app.get('/', (req, res) => {
  res.render('index');
});

// Профіль користувача
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('profile', { user: req.user });
});

// Підключення роутів
app.use('/', require('./routes/auth'));
app.use('/posts', require('./routes/post'));
app.use('/comments', require('./routes/comment'));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущено: http://localhost:${PORT}`));
