const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Middleware перевірки автентифікації
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Список всіх постів
router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author').sort({ createdAt: -1 });
  res.render('posts/index', { posts, user: req.user });
});

// Форма створення нового поста
router.get('/new', isAuthenticated, (req, res) => {
  res.render('posts/new');
});

// Створення поста
router.post('/', isAuthenticated, async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  });
  await post.save();
  res.redirect('/posts');
});

// Перегляд конкретного поста (з коментарями)
const Comment = require('../models/Comment');
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author');
  const comments = await Comment.find({ post: post._id }).populate('author');
  res.render('posts/show', { post, comments, user: req.user });
});

module.exports = router;
