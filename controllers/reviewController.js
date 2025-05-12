let listings=require("../models/listings");
let Reviews=require("../models/review.js")
module.exports.reviewadd=async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    let newreview=new Reviews(req.body.reviews);
    newreview.author=req.user._id;
    console.log(newreview.author)
    listin.reviews.push(newreview);
    await newreview.save();
    await listin.save();
    req.flash("success","new review is added!!");
    res.redirect(`/listings/${id}`)
    
}
module.exports.reviewDelete=async(req,res)=>{
    let { id, reviewId }=req.params;
    await listings.findByIdAndUpdate(id,{$pull: { reviews:reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","review is deleted!!");
    res.redirect(`/listings/${id}`)
}