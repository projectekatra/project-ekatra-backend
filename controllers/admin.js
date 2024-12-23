const axios = require('axios');

require('dotenv').config();
const postDataModel = require('../models/postData.js');
var Category = postDataModel.Schema("Category").model;
var Resource = postDataModel.Schema("Resource").model;
var PendingResource = postDataModel.Schema("PendingResource").model;
const emailer = require('../utils/emailer.js');
// Admin Page
exports.adminPage = function(req, res) {
  res.render("home");
}

// Admin Login
exports.adminLogin = async function(req, res) {
  try {
    if (req.body.username !== process.env.ADMIN_USERNAME) {
      return res.send("Wrong Username <br><a href='/admin'>Try Again</a>");
    }

    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.send("Wrong Password <a href='/admin'>Try Again</a>");
    }

    const pendingResources = await PendingResource.find();
    const categories = await Category.find();
    const catArray = categories.map(x => x.label);
    res.render("adminpage", { posts: pendingResources, categories: catArray });

  } catch (err) {
    res.send("Error occurred while fetching resources or categories.");
  }
}


exports.adminLoad = async function(req, res){
  const userIP = (req.headers['x-forwarded-for'] || '').split(',').at(-1) || req.socket.remoteAddress;
  values = {};
  values.time = new Date();
  values.header = req.headers;
  values.ip1 = req.headers["x-forwarded-for"];
  values.ip2 = req.body.timezone;
  values.ip3 = userIP;
  values.ip4 = req.ip;
  emailer.emailer(5, values);
res.send("loaded");
}

// Admin Decision (Approve Pending Resource)
exports.adminDecision = async function(req, res) {
  try {
    if (req.body.access_code !== process.env.ADMIN_ACCESS_CODE) {
      return res.send("Wrong Access Code!");
    }

    let finalCategory = [
      ...req.body.old_categories.split(", "),
      ...req.body.new_categories_already.split(", "),
      ...req.body.new_categories.split(", ")
    ];

    finalCategory = finalCategory.filter(x => x !== "" && x !== " ");
    const newCategories = req.body.new_categories.split(", ");

    // Update the Resource category
    await Resource.updateOne({ _id: req.body.id }, { category: finalCategory });

    // Save new categories
    for (const label of newCategories) {
      const category = new Category({ label });
      await category.save();
    }

    // Delete the pending resource
    await PendingResource.deleteOne({ _id: req.body.pending_id });

    // Fetch updated pending resources and categories
    const updatedPendingResources = await PendingResource.find();
    const categories = await Category.find();
    const catArray = categories.map(x => x.label);
    res.render("adminpage", { posts: updatedPendingResources, categories: catArray });

  } catch (err) {
    res.send("Error occurred while processing the decision.");
  }
}
