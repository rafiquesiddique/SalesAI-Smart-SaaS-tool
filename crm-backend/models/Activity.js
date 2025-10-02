const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  type: {
    type: String,
    enum: ['call', 'email', 'meeting', 'demo', 'follow_up', 'note'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: String,
  outcome: {
    type: String,
    enum: ['positive', 'neutral', 'negative']
  },
  duration: Number,
  scheduled_date: Date,
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);