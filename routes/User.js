let express=require("express");
let router=express.Router();
let mo=require("method-override");
const wrapAsync=require("../utils/WrapAsync.js");
router.use(express.urlencoded({extended:true}))
const ExpressError=require("../utils/ExpressError.js");
const user=require("../models/user.js");
const passport = require("passport");
const {savedUrl}=require("../middleware.js");
const usercontroller=require("../controllers/usercontroller.js")
//all routes of user
router.get("/signup",wrapAsync(usercontroller.signupForm));
router.post("/signup",wrapAsync(usercontroller.signupPost));
router.get("/login",wrapAsync(usercontroller.loginForm));
router.post("/login",savedUrl,passport.authenticate('local',{failureRedirect:"/login",failureflash:true}),wrapAsync(usercontroller.login));
router.get("/logout",usercontroller.logout)
module.exports=router;