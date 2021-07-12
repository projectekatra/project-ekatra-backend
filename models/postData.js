const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const resourceSchema = new mongoose.Schema({
    heading: String,
    author: String,
    modifiedauthor: Array,
    authorEmail: String,
    link: String,
    description: String,
    category: Array,
    upvotes: Number,
    date: Date,
    visited: Number
    });

const pendingresourceSchema = new mongoose.Schema({
    main_id: String,
    heading: String,
    link: String,
    description: String,
    old_category: Array,
    new_category: Array
    });

const categorySchema = new mongoose.Schema({
    label: String
    });
    
const tipSchema = new mongoose.Schema({
		title: String,
		tip: String,		
		})

mongoose.model("Category", categorySchema);
mongoose.model("Resource", resourceSchema);
mongoose.model("PendingResource", pendingresourceSchema);
mongoose.model("Tip", tipSchema);
module.exports.Schema = function(modelName){
    return {model: mongoose.model(modelName)};
}
