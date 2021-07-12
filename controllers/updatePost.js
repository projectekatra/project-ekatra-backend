const postDataModel = require('../models/postData.js');
var Resource = postDataModel.Schema("Resource").model;
const userDataModel =require('../models/userData.js');
var MemDetail = userDataModel.Schema("MemDetail").model;

exports.visited = function(req,res){
const value = req.body;
res.send();
Resource.findById(value.id, (err, result) => {
        if (err) console.log(err);
        else{
	    result.visited = result.visited + value.value;
	    result.save((err, final) => {
		if (err) console.log(err);
	    });}
       	  if(value.userId!==undefined)
	  {
	      MemDetail.findOneAndUpdate({"id": value.userId},{$push: {"visited": value.id}}, {useFindAndModify: false, new: true}, function(err, res){
	      if(err)
	      console.log(err)
	   })

	}
        });
}

exports.upvote = function(req,res){
   const value = req.body;
   res.send();
   Resource.findById(value.id, (err, result) => {
   	 if (err) console.log(err);
    	else{
    		result.upvotes = result.upvotes + value.value;
    		result.save((err, final) => {
        		if (err) console.log(err);
    		});
	    }
	});
   if(value.value===1)
	{
		MemDetail.findOneAndUpdate({"id": value.userId},{$push: {"upvoted": value.id}}, {useFindAndModify: false, new: true}, function(err, res){
		if(err)
		console.log(err)
		})
	}
   else
	{
		MemDetail.findOneAndUpdate({"id": value.userId},{$pull: {"upvoted": value.id}}, {useFindAndModify: false, new: true}, function(err, res){
		if(err)
		console.log(err)
		})
	}
}

