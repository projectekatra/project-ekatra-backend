const postDataModel = require('../models/postData.js');
const emailer = require('../utils/emailer.js');
var Resource = postDataModel.Schema("Resource").model;
var PendingResource = postDataModel.Schema("PendingResource").model;

exports.contribute = async function(req, res) {
  const value = req.body;
  const link = value.link;
  value.link = link.charAt(link.length - 1) === '/' ? link : link + "/"; // Ensure the link ends with "/"
  const time = new Date();

  const resource_temp = {
    heading: value.heading,
    author: value.name,
    modifiedauthor: [],
    authorEmail: value.email,
    link: value.link,
    description: value.description,
    upvotes: 0,
    date: time,
    visited: 0
  };

  try {
    // Check if the link already exists in the database
    const existingResource = await Resource.find({ link: value.link });

    if (existingResource.length !== 0) {
      return res.status(700).send(); // Resource already exists
    }

    // Separate new and old categories
    const new_categories = value.category.filter(x => x.__isNew__ === true).map(x => x.label);
    const old_categories = value.category.filter(x => x.__isNew__ !== true).map(x => x.label);
    resource_temp.category = old_categories;

    // Create and save the new resource
    const resource = new Resource(resource_temp);
    await resource.save();

    res.send(); // Send response to client

    // Send email if the author email is provided
    if (resource_temp.email !== "") {
      resource_temp.category = value.category;
      if (resource_temp.author === "") {
        resource_temp.author = "Wizard";
      }
      emailer.emailer(1, resource_temp);
    }

    // If there are new categories, create and save a pending resource
    if (new_categories.length !== 0) {
      const pend_resource_temp = {
        main_id: resource._id,
        heading: value.heading,
        link: value.link,
        description: value.description,
        old_category: old_categories,
        new_category: new_categories
      };
      const pend_resource = new PendingResource(pend_resource_temp);
      await pend_resource.save();
    }

  } catch (err) {
    res.status(500).send(); // Handle errors
  }
};
