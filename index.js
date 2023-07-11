require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser")
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser');
const app = express();
const hbs = require('hbs');
// const routes = require('./routes/user');
// const blogroutes = require('./routes/blog');
// app.use("/blog",blogroutes);
const mongoConnect = require("./db/users");
const verifyUser= require('./middlewares/auth');

const staticPath = path.join(__dirname, 'views');
app.use(express.static(staticPath));

const partialPath = path.join(__dirname, 'views', 'partials');

app.set("view engine", "hbs");
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(partialPath);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

hbs.registerHelper('formatDate', function(date) {
  const formattedDate = date.toLocaleString(); // Format the date using JavaScript's toLocaleString()
  return formattedDate;
});

hbs.registerHelper('substring', function(text) {
  const substring = text.substring(0,50) + "...."; // Format the date using JavaScript's toLocaleString()
  return substring;
});


app.get('/', (req, res) => {
  res.render('index');
});


//routes file code

const User = require('./models/Users')

app.get('/signUp', (req, res) => {
  res.render('signUp');
});

app.get('/login', (req, res) => {
  res.render('signIn');
});

app.post('/signUp', async (req, res) => {
    const { name, gender, email, password, profile_image} = req.body;
    await User.create({
        Username: name,
        Email: email,
        Gender:gender,
        ProfileImg:profile_image,
        password: password
    });
  const userFound = await User.findOne({ Email: email });
  const token = await userFound.generateToken();
  res.cookie('jwt', token);
    return res.redirect('/login');
})

app.get('/logout',(req,res)=>{
res.clearCookie('jwt');
res.render('index');
})

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userFound = await User.findOne({ Email: email });
      if (!userFound) {
        return res.render('client');
      }
      
      // const isMatch = await bcrypt.compare(password, userFound.password);
      if (userFound.password == password) {
        // Passwords match, generate token and set cookie
        const token = await userFound.generateToken();
        res.cookie('jwt', token);
        res.render('addBlog');
      } else {
        return res.render('client');
      }
    } 
    catch (error) {
      return res.render('client');
    }
  });
  

  
//routes for Blog 
const Blog = require('./models/blog');

  app.use(express.static(path.resolve('./public')))
  app.get('/blog', verifyUser, async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('blogPage', {
      blogs: allBlogs,
    });
  });


app.get('/addBlog', verifyUser , (req,res)=>{
    res.render('addBlog');
    
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null,fileName);
  }
});

const upload = multer({ storage: storage })

app.post('/addBlog', upload.single('blogImage'), verifyUser, async (req, res) => {
  const { blogTitle, blogDescription } = req.body;

  // Check if title and body are empty
  if (!blogTitle || !blogDescription) {
    return res.status(400).send('Title and description are required');
  }
  try {
    const ans = await req.verifyUserValue;

    await Blog.create({
      
      title: blogTitle,
      body: blogDescription,
      coverImg: `/uploads/${req.file.filename}`,
      creator: ans,
    });
    res.redirect('/blog');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error creating the blog');
  }
});


const Comment = require('./models/chats');

// Chat Routes

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/:id', verifyUser, async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    const blog = await Blog.findById(req.params.id).populate('creator');
    // console.log(comments)
    res.render('chats', { blog , comments });
  } catch (error) {
    console.error(error);
    // Handle the error and return an appropriate response
    res.status(500).send('Internal Server Error');
  }
});



// Chat Routes

app.post("/blogPage/chats/:blogId", verifyUser, async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      blogId: req.params.blogId,
      createdBy: req.verifyUserValue,
    });
    res.redirect('back');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating comment");
  }
});


async function start(){
    try{
    await mongoConnect(process.env.MONGODB_URL);
    app.listen(port,(req,res)=>{
        console.log(`Server is Listening at http://localhost:${port}`);
    })
    }
    catch(err){
        console.log(err);
    }

}
start();