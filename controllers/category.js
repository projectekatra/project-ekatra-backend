const postDataModel = require('../models/postData.js');
var Category = postDataModel.Schema("Category").model;

exports.getCategory = function(req,res){
Category.find(function(err, resources) {
        if (!err) {
            var resources_to_send = resources.map(x => {
                return {
                    label: x.label,
                    value: x.label
                }
            })
            res.send(resources_to_send);
        } else {
            res.send(err);
        }
    });
}
