const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  screenshots: [
    {
      type: String // URL to screenshot image
    }
  ],
  isPublic: {
    type: Boolean,
    default: false
  },
  trades: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trade'
    }
  ],
  dailyProfitLoss: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
JournalEntrySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
