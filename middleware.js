let listings=require("./models/listings");
let Reviews=require("./models/review.js")
const wrapAsync=require("./utils/WrapAsync.js");
const {ListingSchema,reviewSchema}=require("./Schema.js");
const ExpressError=require("./utils/ExpressError.js");
module.exports.loggedIn=(req,res,next)=>{
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
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    const listin=await listings.findById(id);
    if(!listin.owner.equals(res.locals.currentuser._id)){
        req.flash("error","you are not autorize to use this page");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewOwner=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    const listin=await Reviews.findById(reviewId);
    if(!listin.author.equals(res.locals.currentuser._id)){
        req.flash("error","you are not autorize delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.ValidateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error){
        let ErrMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,ErrMsg);
    }else{
        next();
    }
}
module.exports.Validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let ErrMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,ErrMsg);
    }else{
        next();
    }
}