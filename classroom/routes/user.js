let express=require("express");
let router=express.Router();

//user
router.get("/",(req,res)=>{
    res.send("userInformation");
});

router.get("/setCookies",(req,res)=>{
    res.cookie("name","saikiran",{signed:true});
    res.cookie("favColor","black");
    res.cookie("MadeIn","India");
    res.send("cookies added");
});


router.get("/getcookies",(req,res)=>{
    let{name,favColor,MadeIn}=req.cookies;
    console.log(req.signedCookies);
    console.log(name,favColor,MadeIn);
    res.send(`this is for getting cookies`)
})


router.get("/:id",(req,res)=>{
    res.send("userIdInformation");
});
router.post("/",(req,res)=>{
    res.send("userInformation");
});
router.put("/:id",(req,res)=>{
    res.send("userPutInformation");
});
router.delete("/:id",(req,res)=>{
    res.send("userDeleteInformation");
});

module.exports=router;