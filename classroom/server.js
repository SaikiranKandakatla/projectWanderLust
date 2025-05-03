let express=require("express");
let app=express();
let cookieparser=require("cookie-parser");
let user=require("./routes/user")
let posts=require("./routes/posts")
app.get("/",(req,res)=>{
    console.log(`this is home root`)
})
app.use(cookieparser("secret"))

app.use("/user",user)
app.use("/posts",posts)




app.listen(8080,()=>{
    console.log("the sever is started at port 8080")
})