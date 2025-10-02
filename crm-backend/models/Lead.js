const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  company: String,
  position: String,
  phone: String,
  industry: {
    type: String,
    enum: ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Marketing', 'Other']
  },
  company_size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'new'
  },
  lead_score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  estimated_value: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'cold_outreach', 'social_media', 'event', 'advertisement', 'other']
  },
  notes: String,
  last_contact_date: Date,
  next_follow_up: Date,
  pain_points: [String],
  interests: [String],
  ai_insights: String,
  conversation_prep: String,
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);