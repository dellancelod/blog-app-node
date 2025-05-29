const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Middleware перевірки автентифікації
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Створити коментар
router.post('/:postId', isAuthenticated, async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    post: req.params.postId,
    author: req.user._id
  });
  await comment.save();
  res.redirect('/posts/' + req.params.postId);
});

module.exports = router;
