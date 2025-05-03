let express=require("express");
let router=express.Router({mergeParams:true});

//posts
router.get("/",(req,res)=>{
    res.send("userInformation");
});
router.get("/:id",(req,res)=>{
    res.send("userInformation");
});
router.post("/",(req,res)=>{
    res.send("userInformation");
});
router.put("/:id",(req,res)=>{
    res.send("userInformation");
});
router.delete("/:id",(req,res)=>{
    res.send("userInformation");
});
// router.get("/getcookies",(req,res)=>{
//     let{name,favColor,MadeIn}=req.cookies;
//     console.log(name,favColor,MadeIn);
//     res.send(name,favColor);
// })
module.exports=router;