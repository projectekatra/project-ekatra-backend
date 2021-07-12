const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const membersSchema = new Schema({
	email: String,
	hashPass: String,
	activhash: String,
	activated: Number,
	});
const memdetailsSchema = new Schema({
	id: String,
	name: String,
	email: String,
	upvoted: Array,
	contributed: Array,
	visited: Array
	});

mongoose.model("Member",membersSchema);
mongoose.model("MemDetail", memdetailsSchema);
module.exports.Schema = function(modelName){
        return{model:mongoose.model(modelName)}; 
}
