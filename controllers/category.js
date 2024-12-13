const postDataModel = require('../models/postData.js');
var Category = postDataModel.Schema("Category").model;

exports.getCategory = async function(req, res) {
  try {
    const resources = await Category.find();
    const resourcesToSend = resources.map(x => ({
      label: x.label,
      value: x.label
    }));
    res.send(resourcesToSend);
  } catch (err) {
    res.send(err);
  }
}
