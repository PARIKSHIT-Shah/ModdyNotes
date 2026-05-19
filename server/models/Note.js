const mongoose = require('mongoose');

const CATEGORIES = [
  'Personal',
  'Work',
  'Study',
  'Health',
  'Finance',
  'Shopping',
  'Travel',
  'Ideas',
  'Other',
];

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: CATEGORIES,
      default: 'Personal',
    },
    color: {
      type: String,
      default: '#f9fafb',
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 20,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster search
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

noteSchema.statics.CATEGORIES = CATEGORIES;

module.exports = mongoose.model('Note', noteSchema);
