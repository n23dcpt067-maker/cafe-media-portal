const mongoose = require('mongoose');

const SeoSchema = new mongoose.Schema({
  page: { type: String, required: true },
  keywords: [String],
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Seo', SeoSchema);
