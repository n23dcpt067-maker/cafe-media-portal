const mongoose = require('mongoose');

const LivestreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, default: 'stopped' },
  chat: [
    {
      user: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Livestream', LivestreamSchema);
