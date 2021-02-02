const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema(
    {
        mail: String,
        ava: String,
        posts: [ { img: String, description: String, liked: String, postComId: String, comments: [ { author: String, text: String } ] } ],
        // guests: [ { name: String, ava: String, follow: String, posts: [ { img: String, comments: [ { author: String, text: String } ] } ] } ]
        followers: [String]
    }, {collection: "usersData"});
const User = mongoose.model("User", userScheme);

app.use(cors());

const uri = "mongodb+srv://user:123@photo-app.iikrl.mongodb.net/appUsers?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, function(err){
    if(err) return console.log(err);
    app.listen(4000, function(){
        console.log("Сервер ожидает подключения...");
    });
});

app.get("/api/users", function(req, res){

    User.find({}, function(err, users){

        if(err) return console.log(err);
        res.send(users)
    });
});

app.get("/api/users/:id", function(req, res){

    const mail = req.params.id;

    User.findOne({mail: mail}, function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.put("/api/users/", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    const mail = req.body.params.mail;
    const id = req.body.params.id;

    User.updateOne({mail: mail}, {
        $pull: {
            posts: {
                postComId: id
            }
        }
    },function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.put("/api/users/:fav", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    const mail = req.body.params.mail;
    const id = req.body.params.id;
    const liked = req.body.params.liked;

    User.updateOne({mail: mail, "posts.postComId": id}, {
        $set: { "posts.$.liked" : liked }
    },function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.post("/api/comments", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const mail = req.body.params.mail;
    const id = req.body.params.id;
    const userName = req.body.params.userName;
    const userText = req.body.params.userText;

    User.updateOne({mail: mail, "posts.postComId": id}, {
        $addToSet: { "posts.$.comments" :{ author: userName, text: userText } }
    },function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.post("/api/followers", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    const mail = req.body.params.mail;
    const userName = req.body.params.userName;

    User.updateOne({mail: mail}, {
        $addToSet: { followers : userName }
    },function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});

app.put("/api/followers", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    const mail = req.body.params.mail;
    const userName = req.body.params.userName;

    User.updateOne({mail: mail}, {
        $pull: { followers : userName }
    },function(err, user){

        if(err) return console.log(err);
        res.send(user);
    });
});