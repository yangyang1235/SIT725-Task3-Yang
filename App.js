const { response } = require('express');

let express = require('express')
let app = express()
let moment = require('moment')
const mongoose = require ('mongoose')
const User = require('./model/user')
//connect mongodb
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
let http = require('http').createServer(app);
let io = require('socket.io')(http);


 //server static content 'web pages'
 app.use(express.static(__dirname + '/public'));
 app.use(bodyParser.json());
 

 app.get("/test", function (req,res){
     var user_name = req.query.user_name;
     res.end("Hello "+ user_name + "!");
 });


 app.post("/test",(req,res)=>{
  console.log('body',req.body)
  res.send("thank you")
 })

//user register
 app.post('/api/register', async (req,res)=>{
   console.log(req.body)
   
   const { username, password} = req.body
   try {
        const response = await User.create({
          username,
          password
        })
        console.log('User created successfully: ', response)
   } catch (error) {
     console.log(error)
     return res.json({ statud: 'error'})
   }

   res.json({status:'ok'})

 })

 //user signin
 app.post('/api/login', async (req,res) =>{
   const username = req.body.usernae;
   const password = req.body.password;

   User.findOne({username: username, password: password}, function(err,user) {
     if(err) {
       console.log(err);
       return res.status(500).send();
     }

     if(!User) {
       return res.status(404).send();
     }
     return res.status(299).send();
   })

 })


 //get users
 app.get('/users', (req,res)=>{
    getUsers(res)
 })

 //socket test
 io.on('connection', (socket) =>{
   console.log('a user connected');
   socket.on('disconnect', ()=> {
     console.log('user disconnected');
   });
   setInterval(()=>{
     socket.emit('number', parseInt(Math.random()*10));
   },1000);
 })


//connect MongoDB

// const uri = "mongodb+srv://yang:yang123@cluster0.5yrif.mongodb.net/725?retryWrites=true&w=majority";
// const uri = "mongodb://localhost:27017";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// let usersCollection;

// client.connect(err => {
//   usersCollection = client.db("725").collection("users");
//   if(!err){
//     console.log('Database Connected')
//   }
  // perform actions on the collection object
  // client.close();
// });

//insert user into the db
//takes a project entry, add date to it and pushed into the collection
// const inserUser=(user,res)=>{
//   //insert into collection
//   usersCollection.insert(user,(err,result)=>{
//     console.log('User Inserted',result)
//     res.send({result:200})
//   })
// }

// const getUsers=(res)=>{
//   usersCollection.find().toArray(function(err,result) {
//     if(err)throw err;
//     res.send(result)
//   })
// }

// openConnection()




 var log=function(message){
     var time=moment().format()
     console.log('[Server] @' + time+''+message)
 }


 var port= process.env.PORT || 3000;
 app.listen(port)
 log('Server listening on: '+ port)