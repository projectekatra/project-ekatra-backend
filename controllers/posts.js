const postDataModel = require('../models/postData.js');
var Resource = postDataModel.Schema("Resource").model;
var recommender = require('../utils/recommendation.js');

exports.getLatest = function(req,res){
Resource.find(function(err, resources) {
        if (!err) {
            var resources_to_send = resources.sort((a, b) => (a.date.getTime() > b.date.getTime()) ? -1 : 1);
            res.send(resources_to_send.slice(0,12));
        } else {
            res.send(err);
        }
    });
}

exports.getPopular = function(req,res){
Resource.find(function(err, resources) {
        if (!err) {
            var resources_to_send = resources.sort((a, b) => (a.upvotes > b.upvotes) ? -1 : 1)
            res.send(resources_to_send[0]);
        } else {
            res.send(err);
        }
    });
}

exports.getVisited = function(req,res){
Resource.find(function(err, resources) {
        if (!err) {
            var resources_to_send = resources.sort((a, b) => (a.visited > b.visited) ? -1 : 1)
            res.send(resources_to_send[0]);
        } else {
            res.send(err);
        }
    });
}

exports.postDetail = function(req,res){
Resource.findOne({_id: req.params.Id},function(err, resources) {        
if (!err) {
            res.send(resources);
        } else {
            res.send(err);
        }
    });
}

exports.postRecommend = function(req,res){
var id=req.params.Id
    Resource.find(function(err, resources) {
        if (!err) {
            var resources_to_send=recommender.Recommender(resources,id)
            resources_to_send = resources_to_send.slice(0,3)
            res.send(resources_to_send);
        } else {
            res.send(err);
        }
    });
}


exports.postFilter = function(req,res){
var catgry=  req.params.Id
var Search_string = req.params.Search
if(catgry==="all")
{
    Resource.find(function(err,resources){
    if(!err)
    {
         var resources_to_send = recommender.Searching(resources, Search_string)
         res.send(resources_to_send)
    }
    else
    {
         res.send(err)
    }
   })
}
else
{
     Resource.find({category: catgry}, function(err,resources){
     if(!err)
     {
         var resources_to_send = recommender.Searching(resources, Search_string)
	  res.send(resources_to_send)
     }
     else
     {
          res.send(err)
     }
    })
}
}


exports.getAuthor = function(req,res){
Resource.find(function(err, resources) {
        if (!err) {
            var authors = []
            var check_email = []
            resources.forEach(x=>{
            if(!check_email.includes(x.authorEmail))
              {
              check_email.push(x.authorEmail)
              authors.push({name: x.author,email: x.authorEmail, contributions: 1})
              }
             else
              {
              authors[check_email.indexOf(x.authorEmail)].contributions+=1
              }
            })
            res.send(authors);
        } else {
            res.send(err);
        }
    });
}
