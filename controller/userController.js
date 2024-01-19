const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const axios = require('axios');
const { Buffer } = require('buffer');

exports.registerUser = async (req, res, next) => {
  const { username, password } = req.body;
  // const imageUrl = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fuser%2F&psig=AOvVaw32O5jZgJ6ieLVdfXG2M_4N&ust=1705741003130000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCLCfrMaK6YMDFQAAAAAdAAAAABAE'
  try {
    // const response = await fetch(imageUrl);
    // const base64Image = response.toString('base64');


    const user = await User.create({
      username,
      password,
      // avatar: {
      //   profileImage: base64Image,
      // }
    });

    // sendToken(user, 201, res);
  } catch (error) {
    console.error('Error fetching and converting image:', error);
    // Handle the error accordingly
  }
};

exports.loginUser = async ( req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new ErrorHandler("please enter email & password", 400));
  }

  //find user and match password
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
    
  }

  //if the password does not match
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //if the password matches
  sendToken(user, 200, res);
};

exports.logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "user Logged Out",
  });
};

//get all users
exports.allUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
};

//update user profile
exports.updateProfile = async (req, res, next) => {
    const userId = req.user.id;
    const info = {avatar:req.body};
    // console.log(info);
    await User.findByIdAndUpdate(userId, info);

    res.status(200).json({
        success: true,
        status: "updated user",
    })
}

//delete the user only for admin
exports.deleteUser = async(req,res, next) => {
    const {userId} = req.body;

    if(!userId) {
        res.status(400).json({
            success:false,
            message:"no user found",
        })
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({
        success: true,
        status: "deleted user",
    })
}

//approve a user
exports.approveUser = async(req, res, next) => {
    try{
        const {userId} = req.body;
        if(!userId) {
            res.status(400).json({
                success:false,
                message:"no user found",
            })
        }
        await User.findByIdAndUpdate(userId, {approvalStatus:"accepted"});

        res.status(200).json({
            success: true,
            message: "user approved",
        })
    }catch(err) {
        console.log(err);
    }
}


//upload for image upload
// exports.uploadImage = async (req, res) => {
//     try {
//         const gfs = new Grid(mongoose.connection.db, mongoose.mongo);
//         const writeStream = gfs.createWriteStream({
//             filename: req.file.originalname,
//             mode: 'w',
//             content_type: req.file.mimetype,
//         });
//         fs.createReadStream(req.file.path).pipe(writeStream);
//         writeStream.on('close', (file) => {
//             fs.unlink(req.file.path, (err) => {
//                 if (err) throw err;
//                 return res.json({ file });
//             });
//         });
//     } catch (err) {
//         return res.status(400).json({ message: 'Error uploading file', error: err });
//     }
// }