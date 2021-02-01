const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const userScheme = new Schema(
    {
        mail: String,
        posts: [ { img: String, description: String, liked: String, postComId: String, comments: [ { author: String, text: String } ] } ],
        guests: [ { name: String, ava: String, follow: String, posts: [ { img: String, comments: [ { author: String, text: String } ] } ] } ]
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

    console.log(mail)
    console.log(id)

    User.updateOne({}, {
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