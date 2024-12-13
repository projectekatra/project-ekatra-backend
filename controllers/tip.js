const postDataModel = require('../models/postData.js');
var Tip = postDataModel.Schema("Tip").model;

// Get tips
exports.getTips = async function(req, res) {
  try {
    const resources = await Tip.find();
    res.send(resources);
  } catch (err) {
    res.send(err);
  }
}

// Add a new tip
exports.addTip = async function(req, res) {
  try {
    const value = req.body;
    const resource = new Tip(value);
    await resource.save();
    res.send();
  } catch (err) {
    res.send(err);
  }
}
