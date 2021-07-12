require('dotenv').config()
const postDataModel = require('../models/postData.js');
var Category = postDataModel.Schema("Category").model;
var Resource = postDataModel.Schema("Resource").model;
var PendingResource = postDataModel.Schema("PendingResource").model;

exports.adminPage = function(req,res){
    res.render("home");
}

exports.adminLogin = function(req,res){
if(req.body.username!==process.env.ADMIN_USERNAME)
  res.send("Wrong Username <br><a href='/admin'>Try Again</a>")
  else{
    if(req.body.password!==process.env.ADMIN_PASSWORD)
    res.send("Wrong Password <a href='/admin'>Try Again</a>")
    else{
      PendingResource.find(function(err,result){
        if(!err)
        {
          Category.find(function(err,categories){
            if(!err)
            var cat_array = categories.map(x=>x.label)
            res.render("adminpage",{posts: result, categories: cat_array})
          })
        }
      })
    }
  }
}

exports.adminDecision = function(req,res){
if(req.body.access_code==process.env.ADMIN_ACCESS_CODE)
  {
    var final_category = [...req.body.old_categories.split(", "),...req.body.new_categories_already.split(", "),...req.body.new_categories.split(", ")]
    var new_categories = req.body.new_categories.split(", ");
    final_category = final_category.filter(x=>x!="" && x!=" ");
    Resource.updateOne({_id: req.body.id},{category: final_category},function(err,doc){
      if(err)
      res.send("Error While Updating category in Resource.")
      else
      {
        new_categories.forEach((label) => {
            var category = new Category({
                label: label
            });
            category.save();
        });
        PendingResource.deleteOne({_id: req.body.pending_id},function(err){
          if(err)
          res.send("Error while Deleting file from Pending Resources.");
          else{
            PendingResource.find(function(err,result){
              if(!err)
              {
                Category.find(function(err,categories){
                  if(!err)
                  var cat_array = categories.map(x=>x.label)
                  res.render("adminpage",{posts: result, categories: cat_array})
                })
              }
            })
          }
        })
      }
    })
  }
  else
  {
    res.send("Wrong Access Code!");
  }
}
