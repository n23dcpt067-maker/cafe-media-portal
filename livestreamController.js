const Livestream = require('../models/livestreamModel');

exports.startLivestream = async (req, res) => {
  const { title } = req.body;
  try {
    const livestream = new Livestream({ title, status: 'running' });
    await livestream.save();
    res.json(livestream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.stopLivestream = async (req, res) => {
  try {
    const livestream = await Livestream.findByIdAndUpdate(
      req.params.id,
      { status: 'stopped' },
      { new: true }
    );
    res.json(livestream);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const livestream = await Livestream.findById(req.params.id);
    res.json({ status: livestream.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getChat = async (req, res) => {
  try {
    const livestream = await Livestream.findById(req.params.id);
    res.json(livestream.chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.postChat = async (req, res) => {
  try {
    const { user, message } = req.body;
    const livestream = await Livestream.findById(req.params.id);
    livestream.chat.push({ user, message });
    await livestream.save();
    res.json(livestream.chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
