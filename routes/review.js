let express=require("express");
let router=express.Router({mergeParams:true});
const {reviewSchema}=require("../Schema.js");
let listings=require("../models/listings");
let Reviews=require("../models/review.js")
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

let Validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let ErrMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,ErrMsg);
    }else{
        next();
    }
}
//for reviews we use this
router.post("/",Validatereview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    let newreview=new Reviews(req.body.reviews);
    listin.reviews.push(newreview);
    await newreview.save();
    await listin.save();
    req.flash("success","new review is added!!");
    res.redirect(`/listings/${id}`)
    
}))

//delete reviews
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let { id, reviewId }=req.params;
    await listings.findByIdAndUpdate(id,{$pull: { reviews:reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","review is deleted!!");
    res.redirect(`/listings/${id}`)
}));



module.exports=router;