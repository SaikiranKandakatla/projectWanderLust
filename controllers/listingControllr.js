const listings=require("../models/listings");

module.exports.index=async(req,res)=>{
    let listin=await listings.find({});
    res.render("listings/index.ejs",{listin});
}