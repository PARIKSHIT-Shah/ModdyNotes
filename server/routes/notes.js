const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// All routes protected
router.use(protect);

// @route  GET /api/notes
// Query params: category, search, pinned
router.get('/', async (req, res) => {
  try {
    const { category, search, pinned } = req.query;
    const filter = { user: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (pinned === 'true') {
      filter.isPinned = true;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const notes = await Note.find(filter).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  GET /api/notes/categories
router.get('/categories', (req, res) => {
  res.json(Note.CATEGORIES);
});

// @route  POST /api/notes
router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { title, content, category, color, tags, isPinned } = req.body;
      const note = await Note.create({
        user: req.user._id,
        title,
        content,
        category,
        color,
        tags,
        isPinned,
      });
      res.status(201).json(note);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route  PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const fields = ['title', 'content', 'category', 'color', 'tags', 'isPinned', 'isCompleted'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) note[f] = req.body[f];
    });

    const updated = await note.save();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route  DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
