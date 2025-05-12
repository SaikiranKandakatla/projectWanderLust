let user=require("../models/user");
module.exports.signupForm=async(req,res)=>{
    res.render("user/signup.ejs");
}
module.exports.signupPost=async(req,res)=>{
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
}
module.exports.loginForm=async(req,res)=>{
    res.render("user/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let url=res.locals.urlredirect||"/listings"
    res.redirect(url);
    
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){ // mostly we will get error in while passport only
            return next(err);
        }
        req.flash("success","user logged in successfully");
        res.redirect("/listings");
    })
}
