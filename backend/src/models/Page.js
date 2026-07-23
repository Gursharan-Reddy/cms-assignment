const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['header', 'paragraph', 'list', 'table', 'equation'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  blocks: [BlockSchema]
}, { timestamps: true });

module.exports = mongoose.model('Page', PageSchema);