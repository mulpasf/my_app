//  import modules
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//  connect database
mongoose.connect("mongodb://testusr:123qwe..@ds143451.mlab.com:43451/mdb_test01");
var db = mongoose.connection;
db.once("open",function () {
  console.log("DB connected!");
});
db.on("error",function (err) {
  console.log("DB ERROR :", err);
});

//  model setting
var postSchema = mongoose.Schema({
  title: {type:String, required:true},
  body: {type:String, required:true},
  createdAt: {type:Date, default:Date.now},
  updateAt: Date
});
var Post = mongoose.model('post',postSchema);

// view setting
app.set("view engine", 'ejs');

//  set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//  set routes
app.get('/posts', function(req,res){
  Post.find({}).sort('-createAt').exec(function (err,posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/index", {data:posts});
  });
});

app.post('/posts', function(req,res){
  Post.create(req.body.post,function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});

app.get('/posts/:id', function(req,res){
  Post.findById(req,params.id, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});

app.put('/posts/:id', function(req,res){
  req.body.post.updateAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function (err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});
  });
});

app.delete('/posts/:id', function(req,res){
  Post.findByIdAndRemove(req,params.id, function (err,post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" deleted"})
  });
});

//  start Server
app.listen(3000, function(){
  console.log('Server On!');
});
