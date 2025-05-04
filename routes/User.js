let express=require("express");
let router=express.Router();
let mo=require("method-override");
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const user=require("../models/user.js");
const passport = require("passport");
const {savedUrl}=require("../middleware.js");
router.get("/signup",wrapAsync(async(req,res)=>{
    res.render("user/signup.ejs");
}));
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const user1=new user({
        username:username,
        email:email,
        })
        let registeruser=await user.register(user1,password);
        req.login(registeruser,(err)=>{
            if(err) return next(err);
            req.flash("success","welcome to wanderlust");
            res.redirect("/listings")
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",wrapAsync(async(req,res)=>{
    res.render("user/login.ejs");
}));

router.post("/login",savedUrl,passport.authenticate('local',{failureRedirect:"/login",failureflash:true}),wrapAsync(async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let url=res.locals.urlredirect||"/listings"
    res.redirect(url);
    
}));


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){ // mostly we will get error in while passport only
            return next(err);
        }
        req.flash("success","user logged in successfully");
        res.redirect("/listings");
    })
})
module.exports=router;