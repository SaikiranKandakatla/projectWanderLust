module.exports=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","user must logged in");
        return res.redirect("/login");
    }
    next()
}

module.exports.savedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.urlredirect=req.session.redirectUrl;
    }
    next();
}