const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    youtubeId: { type: String, required: true }, // YouTube video ID
    category: { type: String, enum: ['heart', 'diabetes', 'mental', 'nutrition', 'general', 'Heart Health', 'Diabetes', 'Mental Health', 'Nutrition', 'General', 'Fitness', 'Cancer', 'Other'], default: 'general' },
    youtubeUrl: { type: String }, // support full URL too
    thumbnail: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema);
