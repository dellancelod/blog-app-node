const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('../routes/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.use('/', authRoutes);

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /login renders login page', async () => {
    const res = await request(app).get('/login');
    expect(res.statusCode).toBe(200);
  });


  test('GET /logout calls logout and redirects', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.logout = jest.fn(cb => cb());
      next();
    });
    app.get('/logout', authRoutes.stack.find(r => r.route.path === '/logout').route.stack[0].handle);

    const res = await request(app).get('/logout');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/');
  });
});
