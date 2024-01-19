const express = require("express");
const { registerUser, loginUser, logoutUser, allUsers, updateProfile, deleteUser, approveUser, uploadImage } = require("../controller/userController");
const { authorizeRoles, isAuthenticatedUser } = require("../middleware/auth");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.route("/register").post(isAuthenticatedUser, authorizeRoles("admin"),registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/allUsers").get(isAuthenticatedUser, authorizeRoles("admin"),allUsers );

router.route("/updateUser").patch(isAuthenticatedUser, updateProfile);

router.route("/deleteUser").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/approveUser").post(isAuthenticatedUser, authorizeRoles("admin"), approveUser);

// router.route("/upload").post(uploadImage, upload.single('file'));

module.exports = router;