const Seo = require('../models/seoModel');

exports.createSeo = async (req, res) => {
  try {
    const seo = new Seo(req.body);
    await seo.save();
    res.json(seo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllSeo = async (req, res) => {
  try {
    const seoList = await Seo.find();
    res.json(seoList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
