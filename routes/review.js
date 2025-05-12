let express=require("express");
let router=express.Router({mergeParams:true});
const {reviewSchema}=require("../Schema.js");
let listings=require("../models/listings");
let Reviews=require("../models/review.js")
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {loggedIn,Validatereview,isReviewOwner}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviewController.js")
//for reviews we use this
router.post("/",loggedIn,Validatereview,wrapAsync(reviewcontroller.reviewadd))

//delete reviews
router.delete("/:reviewId",loggedIn,isReviewOwner,wrapAsync(reviewcontroller.reviewDelete));

module.exports=router;