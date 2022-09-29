const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bookdetail = require('./model/bookdata')
const userdetail = require('./model/userdata')
const path = require('path')


const app =new express();

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

//TOKEN VERIFICATION METHOD

function verifytoken(req,res,next){
  if(!req.headers.authorization){
    alert('You are not authorized')
    return res.status(401).send('Unauthorized Request 1')
  }
  let token=req.headers.authorization.split(' ')[1]
  if(token == null){
    alert('You are not authorized')
    return res.status(401).send('Unauthorized Request 2')
  }
  let payload=jwt.verify(token,'secretKey')
  console.log(payload)
if(!payload){
  alert('You are not authorized')
  return res.status(401).send('Unauthorized Request 3')
}
next()
} 

//TOKEN VERIFICATION METHOD


app.post("/api/login", (req, res, next) => {
    let fetchedUser;
    console.log(req.body.email)
    x=req.body.email
    userdetail.findOne({Useremail:req.body.email}).then(user=>{
      if(!user){
        return res.status(401).json({
          message: "Auth failed no such user"
        })
      }
      fetchedUser=user;
      console.log(req.body.password)
      console.log(user.Password)
      return (req.body.password ==  user.Password);
    }).then(result=>{
      console.log(fetchedUser)
      if(!result){
        return res.status(401).json({
          message: "Auth failed inccorect password"
        })
      }
      
      // CREATING THE JSON WEBTOKEN WITH SIGNATURE AND KEY
      
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secretKey",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(e=>{
      console.log(e)
    
    })
  })

app.get('/api/viewbooks',verifytoken,(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    bookdetail.find()
    .then((books)=>{
        res.send(books);
    })
})

app.post('/api/addbooks',verifytoken,async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    var book=new bookdetail({
        BookName:req.body.title,
        BookAuthor:req.body.author,
        BookDescription:req.body.desc,
        BookImage:req.body.image
    })
    try{
        const b1 = await(book.save())
        res.json(b1)
    }catch(err){
        res.send('Error')

    }

})

app.post('/api/adduser',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    var user=new userdetail({
        UserName:req.body.name,
        Useremail:req.body.email,
        DOB:req.body.dob,
        PhoneNo:req.body.phone_no,
        Password:req.body.password
    })
    try{
        const u1 = await(user.save())
        res.json(u1)
    }catch(err){
        res.send('Error')

    }

})
app.get('/api/user',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    userdetail.find()
    .then((user)=>{
        res.send(user);
    })
})

app.get('/api/viewbooks/:id',async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    try{
     const book1 = await bookdetail.findById(req.params.id)
     res.send(book1)
    }catch(err){
     res.send("Error" + err) 
    }
 })

 app.patch('/api/:id',verifytoken,async(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
    try{
     const book1 = await bookdetail.findById(req.params.id)
     
    book1.BookName=req.body.title
    book1.BookAuthor=req.body.author
    book1.BookDescription=req.body.desc
    book1.BookImage=req.body.image
     
     const b1 = await book1.save()
     res.json(b1)
    }catch(err){
     res.send("Error" + err) 
    }
 })

 app.delete('/api/:id',verifytoken,async(req,res)=>{
    try{
     const book1 = await bookdetail.findById(req.params.id)
     const b1 = await book1.remove()
     res.json(b1)
    }catch(err){
     res.send("Error" + err) 
    }
 })

 app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname + '/public/index.html'));
 })

app.listen(3001,()=>{
    console.log('listening to port 3001')
})