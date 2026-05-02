const Place = require('../models/Place');

exports.getPlaces = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    
    if (req.query.category) {
      query = Place.find({ category: req.query.category });
    } else {
      query = Place.find();
    }
    
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-createdAt');
    }

    const places = await query;
    res.status(200).json({ success: true, count: places.length, data: places });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getPlace = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: place });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!place) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: place });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deletePlace = async (req, res, next) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
