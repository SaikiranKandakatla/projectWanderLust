let express=require("express");
let app=express();
let ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
let mongoose=require("mongoose");
let mo=require("method-override");
app.use(mo("_method"));
let path=require("path");
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

//backend connection
app.listen(8080,()=>{
    console.log("The server is running at 8080");
});
//home Page
app.get("/listings",async(req,res)=>{
    let listin=await listings.find({});
    res.render("listings/index.ejs",{listin});
});

//create new page
app.get("/listings/new",async(req,res)=>{
    res.render("listings/create.ejs");
});
//show page
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    res.render("listings/show.ejs",{listin});
});
//create new page
app.post("/listings",(req,res)=>{
    let listin=req.body.listing;
    let user=new listings(listin)
    user.save();
    res.redirect("/listings");
});
//editing
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findById(id);
    res.render("listings/edit.ejs",{listin});
});

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await listings.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");
});
// delete 
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let listin=await listings.findByIdAndDelete(id);
    console.log(listin);
    res.redirect("/listings");
});
//home root
app.get("/",(req,res)=>{
    res.send("This is root");
});