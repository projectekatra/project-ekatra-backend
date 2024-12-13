const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const md5 = require("md5");
const saltRounds = 2;

const emailer = require('../utils/emailer.js');
const userDataModel = require('../models/userData.js');
var Member = userDataModel.Schema("Member").model;
var MemDetail = userDataModel.Schema("MemDetail").model;

// Registration
exports.registration = async function(req, res) {
  try {
    const value = req.body;
    const password = value.pass;

    const result = await Member.find({ email: value.email });

    if (result.length !== 0) {
      return res.status(700).send();
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const activHash = uuidv4();
    const newUser = new Member({
      email: value.email,
      hashPass: hash,
      activhash: activHash,
      activated: 0
    });

    await newUser.save();

    const id_user = md5(newUser._id);
    const newUserDetails = new MemDetail({
      id: id_user,
      name: value.name,
      email: value.email,
      upvoted: [],
      contributed: [],
      visited: []
    });

    await newUserDetails.save();
    emailer.emailer(2, { name: value.name, email: value.email, hash: activHash });
    res.send({ id: id_user });

  } catch (err) {
    res.send(err);
  }
}

// Login
exports.login = async function(req, res) {
  const { email, pass } = req.body;

  try {
    const foundUser = await Member.findOne({ email });

    if (!foundUser) {
      return res.status(610).send();
    }

    const result = await bcrypt.compare(pass, foundUser.hashPass);

    if (result) {
      res.send({ id: md5(foundUser._id) });
    } else {
      res.status(600).send();
    }

  } catch (err) {
    res.send(err);
  }
}

// Get User Data
exports.getUserData = async function(req, res) {
  const { userId } = req.params;

  try {
    const result = await MemDetail.findOne({ id: userId });
    res.send(result);
  } catch (err) {
    res.send(err);
  }
}

// Activate User
exports.activateUser = async function(req, res) {
  const { Hash } = req.params;

  try {
    const foundUser = await Member.findOne({ activhash: Hash });

    if (foundUser) {
      foundUser.activhash = null;
      foundUser.activated = 1;
      await foundUser.save();
      res.status(202).send();
    } else {
      res.status(204).send();
    }

  } catch (err) {
    console.log(err);
  }
}

// Check if reset password exists
exports.resetPasswordExists = async function(req, res) {
  const { Hash } = req.params;

  try {
    const foundUser = await Member.findOne({ activhash: Hash });

    if (foundUser) {
      res.status(202).send();
    } else {
      res.status(204).send();
    }

  } catch (err) {
    console.log(err);
  }
}

// Reset password request
exports.resetCreate = async function(req, res) {
  const { email } = req.body;

  try {
    const foundUser = await Member.findOne({ email });

    if (foundUser) {
      const hash = uuidv4();
      foundUser.activhash = hash;
      await foundUser.save();

      res.status(200).send();
      emailer.emailer(3, { email: email, hash: hash });
    } else {
      res.status(310).send();
    }

  } catch (err) {
    console.log(err);
  }
}

// Reset Password
exports.resetPassword = async function(req, res) {
  const { hash, pass } = req.body;

  try {
    const foundUser = await Member.findOne({ activhash: hash });

    if (foundUser) {
      const hashedPassword = await bcrypt.hash(pass, saltRounds);
      foundUser.hashPass = hashedPassword;
      foundUser.activhash = null;
      await foundUser.save();

      res.status(200).send();
    } else {
      res.status(210).send();
    }

  } catch (err) {
    console.log(err);
  }
}
