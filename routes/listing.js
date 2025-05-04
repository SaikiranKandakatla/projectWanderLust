let express=require("express");
let router=express.Router();
let mo=require("method-override");
const {ListingSchema}=require("../Schema.js");
const wrapAsync=require("../utils/WrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
let listings=require("../models/listings");
const session = require("express-session");
let ValidateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error){
        let ErrMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,ErrMsg);
    }else{
        next();
    }
}
//home Page
router.get("/",wrapAsync(async(req,res)=>{
    let listin=await listings.find({});
    res.render("listings/index.ejs",{listin});
}));

//create new page
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("listings/create.ejs");
}));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listin=await listings.findById(id).populate("reviews");
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listin});
}));
//editing
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listin});
}));

router.put("/:id",ValidateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await listings.findByIdAndUpdate(id,req.body.listing);
    req.flash("success","Listing is updated Successfully!!");
    res.redirect("/listings");
}));
//create new page
router.post("/",ValidateListing,wrapAsync(async(req,res,next)=>{
    let listin=req.body.listing;
    let user=await new listings(listin)
    await user.save();
    req.flash("success","new Listing is added!!");
    res.redirect("/listings");
    
}));
//delete
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndDelete(id);
    console.log(listin);
    req.flash("success","Listing is deleted successfully!!");
    res.redirect("/listings");
}));

module.exports=router;