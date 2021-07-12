const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const md5 = require("md5");
const saltRounds = 2;

const emailer = require('../utils/emailer.js')
const userDataModel = require('../models/userData.js');
var Member = userDataModel.Schema("Member").model;
var MemDetail = userDataModel.Schema("MemDetail").model;


exports.registration =  function(req,res){
const  value = req.body;
	const password = value.pass;
    Member.find({
                    email: value.email
                }, function(err, result) {
                    if (!err) {
                        if (result.length !== 0) {
                            res.status(700).send();
                        } else {
				bcrypt.hash(password, saltRounds, function(err, hash){
				var activHash = uuidv4();
				const newUser  = new Member({
							email: value.email,
							hashPass: hash,
							activhash: activHash,
							activated: 0
							})
				newUser.save(function(err){
				if(err)
				res.send(err);
				else
				{
					var id_user = md5(newUser._id)
					const newUserDetails = new MemDetail({
									id: id_user,
									name: value.name,
									email: value.email,
									upvoted: [],
									contributed: [],
									visited: []
									})
					newUserDetails.save(function(err2){
						if(err2){
							Member.findOneAndDelete({email: value.email})
							res.send(err2);
							}
						else
							{
							emailer.emailer(2, {name: value.name,email: value.email,hash:activHash});
							res.send({id: id_user})
							}
						});
		         	}
			})
			})
  }
	}
	else
	{
	res.send(err)
	}
    });
}

exports.login = function(req,res){
var email = req.body.email;
var password= req.body.pass;
Member.findOne({email: email}, function(err, foundUser){
	if(err)
	{
	res.send(err)
	}
	else {
	if(foundUser) {
	bcrypt.compare(password, foundUser.hashPass, function(err,result){
		if(result === true)
		{
		res.send({id: md5(foundUser._id)})
		}
		else
		{
		res.status(600).send()
		}
	})
	}
		else
	{
	res.status(610).send()	
    }	
	}
	})
}

exports.getUserData = function(req,res){
var userId = req.params.userId;
MemDetail.findOne({id: userId}, function(err,result){
  if(err)
	{
	res.send(err)
	}
  else
	{
	res.send(result);
	}
	})
}

exports.activateUser = function(req,res){
	var Hash = req.params.Hash;
	Member.findOne({activhash: Hash}, function(err, foundUser){
		if(err)
		console.log(err);
		else
		{
		    if(foundUser){
			    foundUser.activhash = null;
			    foundUser.activated = 1;
			    foundUser.save(function(err){
			    if(err)
			    console.log(err)
			    else
			    {
			    res.status(202).send();
			    }
			    })
		    }
		    else
		    {
		    	res.status(204).send();
		    }
		    
		}
	})
}


//Working On Reset Password.
exports.resetPasswordExists = function(req,res){
       var Hash = req.params.Hash;
       Member.findOne({activhash: Hash}, function(err, foundUser){
       if(err)
       console.log(err);
       else
       {
          if(foundUser){
             res.status(202).send();
          }
          else
          {
             res.status(204).send();
          }
       }
       })
}

exports.resetCreate = function(req,res){
var email = req.body.email;
Member.findOne({email: email}, function(err, foundUser){
if(err)
console.log(err);
else
{
if(foundUser){
	var hash = uuidv4();
	    foundUser.activhash = hash;
	    foundUser.save(function(err){
	    if(err)
	    console.log(err)
	    else
	    {
	    res.status(200).send();
	    emailer.emailer(3, {email: email, hash:hash});
	    }
	    })
	
}
else
{
res.status(310).send();
}
}
})
}

exports.resetPassword = function(req,res){
var hash = req.body.hash;
var pass = req.body.pass;
Member.findOne({activhash: hash}, function(err, foundUser){
if(err)
console.log(err);
else
{
if(foundUser){
bcrypt.hash(pass, saltRounds, function(err, hash){
if(err)
console.log(err)
else
{
foundUser.hashPass= hash;
foundUser.activhash= null;
foundUser.save(function(err){
if(err) console.log(err);
else res.status(200).send(); 
})
}
})
}
else
{
res.status(210).send();
}
}
})
}
