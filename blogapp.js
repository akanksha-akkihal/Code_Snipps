const express = require('express');
const morgan =require('morgan');
const mongoose=require('mongoose');
const Blog =require('./models/blog');
const { response } = require('express');
const { render } = require('ejs');
const {url}=require('./url');
//express app
const app= express();

//connect to mongodb
const dbURI = url;
mongoose.connect(dbURI,{ useNewUrlParser:true, useUnifiedTopology: true})
  .then((result)=>app.listen(3000))
  .catch((err)=>console.log(err));
//register view engine
app.set('view engine','ejs');

//listen for requests


//middle ware and static files
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

//third-party middleware
app.use(morgan('dev'));



//routes
app.get('/',(req, res)=>{
  res.redirect('./blogs');
});


app.get('/about1',(req, res)=>{
  res.render('about1',{title: "About"});
});

//blog routes
app.get('/blogs',(req,res)=>{
  Blog.find().sort({ createdAt: -1})
    .then((result)=>{
      res.render('index1',{title:'All Blogs',blogs: result})
    })
    .catch((err)=>{
      console.log(err);
    })
})

app.get('/blogs/create',(req, res)=>{
  res.render('create',{title: "Ceate a new blog"});
});

app.post("/blogs",(req,res)=>{
  const blog = new Blog(req.body);

  blog.save()
    .then((result)=>{
      res.redirect('/blogs');
      
    })
    .catch((err)=>{
      console.log(err);
    })
})

app.get('/blogs/:id',(req,res)=>{
  const id= req.params.id;
  Blog.findById(id)
    .then((result) =>{
      res.render('details',{blog :result, title:'Blog Details'});
    })
    .catch((err)=>{
      console.log(err);
    });
})

app.delete('/blogs/:id',(req,res)=>{
  const id=req.params.id;

  Blog.findByIdAndDelete(id)
    .then(result=>{
      res.json({redirect:'/blogs'})
    })
    .catch(err=> {
      console.log(err)
    })
})





app.use((req,res)=>{
  res.status(404).render('404',{title: '404'});
});