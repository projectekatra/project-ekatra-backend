const postDataModel = require('../models/postData.js');
var Resource = postDataModel.Schema("Resource").model;
var recommender = require('../utils/recommendation.js');

// Get latest resources
exports.getLatest = async function(req, res) {
  try {
    const resources = await Resource.find();
    const resourcesToSend = resources.sort((a, b) => (a.date.getTime() > b.date.getTime()) ? -1 : 1);
    res.send(resourcesToSend.slice(0, 12));
  } catch (err) {
    res.send(err);
  }
}

// Get most popular resource
exports.getPopular = async function(req, res) {
  try {
    const resources = await Resource.find();
    const resourcesToSend = resources.sort((a, b) => (a.upvotes > b.upvotes) ? -1 : 1);
    res.send(resourcesToSend[0]);
  } catch (err) {
    res.send(err);
  }
}

// Get most visited resource
exports.getVisited = async function(req, res) {
  try {
    const resources = await Resource.find();
    const resourcesToSend = resources.sort((a, b) => (a.visited > b.visited) ? -1 : 1);
    res.send(resourcesToSend[0]);
  } catch (err) {
    res.send(err);
  }
}

// Get specific post details
exports.postDetail = async function(req, res) {
  try {
    const resource = await Resource.findOne({ _id: req.params.Id });
    res.send(resource);
  } catch (err) {
    res.send(err);
  }
}

// Get recommendations based on a post ID
exports.postRecommend = async function(req, res) {
  try {
    const resources = await Resource.find();
    let resourcesToSend = recommender.Recommender(resources, req.params.Id);
    resourcesToSend = resourcesToSend.slice(0, 3);
    res.send(resourcesToSend);
  } catch (err) {
    res.send(err);
  }
}

// Filter resources based on category and search string
exports.postFilter = async function(req, res) {
  try {
    let resources;
    const { Id: catgry, Search: SearchString } = req.params;

    if (catgry === "all") {
      resources = await Resource.find();
    } else {
      resources = await Resource.find({ category: catgry });
    }

    const filteredResources = recommender.Searching(resources, SearchString);
    res.send(filteredResources);
  } catch (err) {
    res.send(err);
  }
}

// Get authors and their contributions
exports.getAuthor = async function(req, res) {
  try {
    const resources = await Resource.find();
    const authors = [];
    const checkEmail = [];

    resources.forEach(x => {
      if (!checkEmail.includes(x.authorEmail)) {
        checkEmail.push(x.authorEmail);
        authors.push({ name: x.author, email: x.authorEmail, contributions: 1 });
      } else {
        authors[checkEmail.indexOf(x.authorEmail)].contributions += 1;
      }
    });

    res.send(authors);
  } catch (err) {
    res.send(err);
  }
}
