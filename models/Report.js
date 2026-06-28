const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema(
  {
    screenshotUrl: { type: String, default: null },
    imageUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true, index: true },

  reporterUserId: { type: String, default: null },
  reporterEmail: { type: String, default: null },
  reportedUserId: { type: String, default: null },

  contentType: { type: String, required: true },
  contentId: { type: String, default: null },

  reportReason: { type: String, required: true },
  description: { type: String, required: true, maxlength: 2000 },

  evidence: { type: EvidenceSchema, default: () => ({}) },

  status: {
    type: String,
    enum: ['pending', 'queued', 'in_review', 'resolved', 'dismissed'],
    default: 'pending',
    index: true,
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'highest'],
    default: 'low',
    index: true,
  },

  moderatorNotes: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
});

ReportSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Report', ReportSchema);

