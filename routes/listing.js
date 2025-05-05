let express=require("express");
let router=express.Router();
let mo=require("method-override");
const {ListingSchema}=require("../Schema.js");
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
let listings=require("../models/listings");
const {loggedIn,isOwner,ValidateListing}=require("../middleware.js");
const session = require("express-session");
const ListingController=require("../controllers/listingControllr.js")

//home Page
router.get("/",wrapAsync(ListingController.index));

//create new page
router.get("/new",isOwner,(req,res)=>{
    res.render("listings/create.ejs");
});

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listin=await listings.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listin});
}));
//editing
router.get("/:id/edit",loggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listin});
}));

router.put("/:id",loggedIn,isOwner,ValidateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await listings.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing is updated Successfully!!");
    res.redirect("/listings");
}));
//create new page
router.post("/",loggedIn,ValidateListing,wrapAsync(async(req,res,next)=>{
    let listin=req.body.listing;
    const newListing=await new listings(listin)
    newListing.owner=req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success","new Listing is added!!");
    res.redirect("/listings");
    
}));
//delete
router.delete("/:id",loggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndDelete(id);
    console.log(listin);
    req.flash("success","Listing is deleted successfully!!");
    res.redirect("/listings");
}));

module.exports=router;