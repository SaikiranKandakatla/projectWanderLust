let express=require("express");
let app=express();
let ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
let mongoose=require("mongoose");
let mo=require("method-override");
const ListingSchema=require("./Schema.js");
const wrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
app.use(mo("_method"));
let path=require("path");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
//Mongoose connections--backend database connection
let listings=require("./models/listings");
let Mongo_Url="mongodb://127.0.0.1:27017/listings";
main().then(()=>{
    console.log("The database connection has setUp succesfully");
}).catch((err)=>{
   console.log("err is"+err);
})
async function main(){
    await mongoose.connect(Mongo_Url);
}

let ValidateListing=(req,res,next)=>{
    let {error}=ListingSchema.validate(req.body);
    if(error){
        let ErrMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,ErrMsg);
    }else{
        next();
    }
}


// //home root
// app.get("/",(req,res)=>{
//     res.send("This is root");
// });
//home Page
app.get("/listings",wrapAsync(async(req,res)=>{
    let listin=await listings.find({});
    res.render("listings/index.ejs",{listin});
}));

//create new page
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("listings/create.ejs");
}));
app.all(/(.*)/, (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    res.render("listings/show.ejs",{listin});
}));
//editing
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    res.render("listings/edit.ejs",{listin});
}));

app.put("/listings/:id",ValidateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await listings.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");
}));
// delete 
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndDelete(id);
    console.log(listin);
    res.redirect("/listings");
}));
//create new page
app.post("/listings",ValidateListing,wrapAsync(async(req,res,next)=>{
    let listin=req.body.listing;
    let user=await new listings(listin)
    await user.save();
    res.redirect("/listings");
    
}));
//show page
app.all(/(.*)/, (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!"));
});
app.use((req,res,next)=>{
    req.time=new Date(Date.now());
    console.log(req.hostname,req.method,req.time);
})
// if it is not matches with any route we need to show page not found

//errorHandler
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("Error.ejs",{err});
})
//backend connection
app.listen(8080,()=>{
    console.log("The server is running at 8080");
});

