let express=require("express");
let app=express();
let ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
let mongoose=require("mongoose");
let mo=require("method-override");
let path=require("path");
const session=require("express-session");
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError.js");
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
app.use(mo("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
//Mongoose connections--backend database connection
const sessionOptions={
    secret:"mysecretsuperKey",
    resave:false,
    saveUninitialized:true,
    cookie: {expires:Date.now()+1000*60*60*24*3,maxAge: 1000*60*60*24*3, httpOnly: true }
}

let Mongo_Url="mongodb://127.0.0.1:27017/listings";
main().then(()=>{
    console.log("The database connection has setUp succesfully");
}).catch((err)=>{
   console.log("err is"+err);
})
async function main(){
    await mongoose.connect(Mongo_Url);
}



// //home root
app.get("/",(req,res)=>{
    res.send("This is root");
});
app.use(session(sessionOptions))
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);


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

