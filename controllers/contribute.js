const postDataModel = require('../models/postData.js');
const emailer = require('../utils/emailer.js');
var Resource = postDataModel.Schema("Resource").model;
var PendingResource = postDataModel.Schema("PendingResource").model;
exports.contribute = function(req,res){
const value = req.body;
            const link = value.link
            value.link = link.charAt(link.length-1)==='/'?link:link+"/"
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
            }
            //Here check if the link already exists in database.
            Resource.find({
                    link: value.link
                }, function(err, result) {
                    if (!err) {
                        if (result.length !== 0) {
                            res.status(700).send();
                        } else {
                            var new_categories = value.category.filter(x => x.__isNew__ === true).map(x => x.label)
                            var old_categories = value.category.filter(x => x.__isNew__ !== true).map(x => x.label)
                            resource_temp.category = old_categories
                            var resource = new Resource(resource_temp)
                            resource.save(function(err, result) {
                                    if (err) {
                                        res.status(500).send();
                                    } else {
                                        res.send();
                                        if (resource_temp.email !== "") {
                                            resource_temp.category = value.category;
                                            if (resource_temp.author === "") {
                                                resource_temp.author = "Wizard";
                                            }
                                            emailer.emailer(1, resource_temp);
                                        }
                                        if (new_categories.length !== 0) {
                                            const pend_resource_temp = {
                                                main_id: resource._id,
                                                heading: value.heading,
                                                link: value.link,
                                                description: value.description,
                                                old_category: old_categories,
                                                new_category: new_categories
                                            }
                                            var pend_resource = new PendingResource(pend_resource_temp);
                                            pend_resource.save();
                                        }}
                                    })

                            }
                        }
        });
}
