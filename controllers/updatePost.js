const postDataModel = require('../models/postData.js');
var Resource = postDataModel.Schema("Resource").model;
const userDataModel = require('../models/userData.js');
var MemDetail = userDataModel.Schema("MemDetail").model;

exports.visited = async function(req, res) {
  const value = req.body;
  res.send();

  try {
    // Find the resource by ID and update its visited count
    const resource = await Resource.findById(value.id);
    if (resource) {
      resource.visited += value.value;
      await resource.save(); // Save the updated resource
    }

    // If userId is provided, update the user's visited list
    if (value.userId !== undefined) {
      await MemDetail.findOneAndUpdate(
        { "id": value.userId },
        { $push: { "visited": value.id } },
        { useFindAndModify: false, new: true }
      );
    }

  } catch (err) {
    console.log(err); // Log any errors
  }
};

exports.upvote = async function(req, res) {
  const value = req.body;
  res.send();

  try {
    // Find the resource by ID and update its upvotes count
    const resource = await Resource.findById(value.id);
    if (resource) {
      resource.upvotes += value.value;
      await resource.save(); // Save the updated resource
    }

    // Update the user's upvoted list based on whether the upvote value is 1 or -1
    if (value.value === 1) {
      await MemDetail.findOneAndUpdate(
        { "id": value.userId },
        { $push: { "upvoted": value.id } },
        { useFindAndModify: false, new: true }
      );
    } else {
      await MemDetail.findOneAndUpdate(
        { "id": value.userId },
        { $pull: { "upvoted": value.id } },
        { useFindAndModify: false, new: true }
      );
    }

  } catch (err) {
    console.log(err); // Log any errors
  }
};
