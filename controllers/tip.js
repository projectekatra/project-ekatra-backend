const postDataModel = require('../models/postData.js');
var Tip = postDataModel.Schema("Tip").model;

exports.getTips = function(req,res){
Tip.find(function(err, resources) {
        if (!err) {
            res.send(resources);
        } else {
            res.send(err);
        }
    });
}

exports.addTip = function(req, res){
const value = req.body;

var resource  = new Tip(value);
resource.save(function(err){
if(!err)
 {
    res.send();
 }
else
{
  res.send(err)
}
});
}
