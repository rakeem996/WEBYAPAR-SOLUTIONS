const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path'); 
const app = express();
const User = require('./models/userModel');
const multer = require("multer");
const fs = require("fs");

app.use(express.json());
app.use(cookieParser());

//frontend templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static('public'));

//routes imports
const user = require("./routes/userRoutes");
const { loginUser, allUsers } = require('./controller/userController');
const { authorizeRoles, isAuthenticatedUser } = require('./middleware/auth');
app.use("/api/v1",user);

//setting pages
app.get("/", (req, res) => res.render("home"));

app.get("/login", (req, res) => res.render("login"));

app.get("/admin",isAuthenticatedUser,authorizeRoles("admin"), async (req, res) => {
    const usersData = await User.find();
    res.render("admin", { users: usersData })
})

app.get("/basic",isAuthenticatedUser,authorizeRoles("user"), (req, res) => {
    const userData = req.user;
    // console.log(req.user);
    res.render("user", { user: userData});
})

app.get("/admin/view-users",isAuthenticatedUser,authorizeRoles("admin"), async (req, res) => {
    const usersData = await User.find();

    // const data = await bodydata.json()
    // console.log(data)
    res.render('view-users', { users: usersData });
})

//uploading image in user db----------

//creatign local disk storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({ storage: storage });


  app.post("/update-profile", isAuthenticatedUser, upload.single("profileImage"), async (req, res) => {
    try {
        const userId = req.user._id;
        const { name } = req.body;

        const obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname, "/uploads/", req.file.filename)),
                contentType: "image/png",
            },
        };

        const base64Image = obj.img.data.toString('base64');
        
        await User.findByIdAndUpdate(userId, { avatar: { name: name, profileImage: base64Image },updated:true });
        res.render('user', {user: req.user}); 

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});






module.exports = app;