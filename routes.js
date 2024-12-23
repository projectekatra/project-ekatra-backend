exports.setRequestUrl = function(app){
const user = require('./controllers/user.js');
const admin = require('./controllers/admin.js');
const tip = require('./controllers/tip.js');
const category = require('./controllers/category.js');
const contribute = require('./controllers/contribute.js');
const posts = require('./controllers/posts.js');
const updatePost = require('./controllers/updatePost.js');
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true })
var jsonParser = bodyParser.json()
////Handling Admin Routes///
app.get("/admin",urlencodedParser,admin.adminPage)
app.post("/api/load", urlencodedParser, admin.adminLoad)
app.get("/admin/post",urlencodedParser,admin.adminPage)
app.post("/admin",urlencodedParser,admin.adminLogin)
app.post("/admin/post",urlencodedParser,admin.adminDecision);
///Handling (Post) Get Routes
app.get("/api/categories",jsonParser, category.getCategory)
app.get("/api/posts/latest",jsonParser,posts.getLatest);
app.get("/api/posts/popular",jsonParser,posts.getPopular)
app.get("/api/posts/visited",jsonParser,posts.getVisited)
app.get("/api/authors",jsonParser, posts.getAuthor)
app.get("/api/contents/:Id?/:Search?",jsonParser, posts.postFilter)
app.get("/api/post/:Id",jsonParser, posts.postDetail)
app.get("/api/recommend/post/:Id",jsonParser, posts.postRecommend)
/////Handling (Post) Post requests////
app.post("/api/visitedadd",jsonParser,updatePost.visited);
app.post("/api/upvote",jsonParser, updatePost.upvote);
app.post("/api/contribute",jsonParser, contribute.contribute);
/////Handling Tip request///////
app.post("/api/addtip",jsonParser,tip.addTip);
app.get("/api/gettips",jsonParser, tip.getTips);
////Handling User requests
app.post("/api/registration",jsonParser,user.registration)
app.get("/api/userData/:userId", user.getUserData)
app.post("/api/login",jsonParser,user.login)
app.get("/api/user/activate/:Hash", user.activateUser)
app.post("/api/forgot", jsonParser,user.resetCreate)
app.get("/api/user/resetCheck/:Hash", user.resetPasswordExists)
app.post("/api/reset",jsonParser, user.resetPassword)
}
