const { response } = require("express");
const listings=require("../models/listings");
// let {fetch}=require("../tomtomconnection.js");
async function fetchh(p){
    fetch(p)= await require("../tomtomconnection.js");
    return fetch;
}

//this is for mapbox only 
// const mapgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const maptoken=process.env.Map_Token;
// const geocodingClient=mapgeocoding({accessToken:maptoken}) // for calling mapbox apis
console.log(fetch);
// for tomtom we use axious
module.exports.index=async(req,res)=>{
    let listin=await listings.find({});
    res.render("listings/index.ejs",{listin});
}
module.exports.createHomepage=(req,res)=>{
    res.render("listings/create.ejs");
}
module.exports.show=async(req,res)=>{
    let {id}=req.params;
    const listin=await listings.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listin});
}
module.exports.edit=async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    if(!listin){
        req.flash("error","the listing is not exist");
        return res.redirect("/listings");
    }
//src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"                                                                                             //replaced &w=800
    let originalurl=listin.image.url;
    originalurl= originalurl.replace("/upload","/upload/h_150,w_250");
    res.render("listings/edit.ejs",{listin,originalurl});
}

module.exports.update=async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndUpdate(id,req.body.listing);
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listin.image={url,filename};
        await listin.save();
    }
    req.flash("success","Listing is updated Successfully!!");
    res.redirect("/listings");
}
module.exports.postingdata=async(req,res,next)=>{
    //for tomtom
    // this is for mapbox websites
    // let response=await geocodingClient
    // .forwardGeocode({
    //     query: 'Paris, France',
    //     limit: 2
    //   })
    // .send()
    // console.log(response);
    // res.send("done!");
    
    let {filename}=req.file;
    let url=req.file.path;
    console.log(url,"   ",filename);
    let listin=req.body.listing;
    const newListing=await new listings(listin)
    newListing.owner=req.user._id;
    newListing.image={filename,url};
    await newListing.save();
    //tomtom
    console.log(newListing);
    req.flash("success","new Listing is added!!");
    res.redirect("/listings");
    
}

module.exports.destroyRoute=async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndDelete(id);
    console.log(listin);
    req.flash("success","Listing is deleted successfully!!");
    res.redirect("/listings");
}