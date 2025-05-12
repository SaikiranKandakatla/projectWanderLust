if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


let express=require("express");
let app=express();
let ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
let mongoose=require("mongoose");
let mo=require("method-override");
let path=require("path");
const session=require("express-session");
const Mangostore=require("connect-mongo");
const flash=require("connect-flash");
const user=require("./models/user.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const ExpressError=require("./utils/ExpressError.js");
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const userrouter=require("./routes/User.js");
const loggedIn=require("./middleware.js");
const multer=require("multer");
const MongoStore = require("connect-mongo");
const upload=multer({dest:"uploads/"});

app.use(mo("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
let Mongo_Url=process.env.dburl;
//Mongoose connections--backend database connection
const store=MongoStore.create({
    mongoUrl:Mongo_Url,
    crypto:{
        secret:"mysecretsuperKey"
    },
    touchAfter:24*3600
})
const sessionOptions={
    store,
    secret:"mysecretsuperKey",
    resave:false,
    saveUninitialized:true,
    cookie: {expires:Date.now()+1000*60*60*24*3,maxAge: 1000*60*60*24*3, httpOnly: true }
}

// let Mongo_Url="mongodb://127.0.0.1:27017/listings";

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
app.use(passport.initialize());
app.use(passport.session());// line 48 49 is used for intilize passport for every route
passport.use(new localStrategy(user.authenticate()));//connecting passport in user strategy
passport.serializeUser(user.serializeUser());//shows how to store foramt
passport.deserializeUser(user.deserializeUser());// show how retrieves the stored data



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentuser=req.user;
    next();
})

app.use("/listings",listing);
app.use("/listings/:id/reviews",review);
app.use("/",userrouter);
// app.get("/demoUser",(req,res)=>{
//     const user1=new user({
//         email:"saikiran@gmail.com",
//         username:"Saikiran"
//     })

//     user.register(user1,"saikiran");
//     console.log(user1);
//     res.send("the user register successfully")
// })

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

