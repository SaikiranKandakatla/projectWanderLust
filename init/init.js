let mongoose=require("mongoose");
let Mongo_Url="mongodb://127.0.0.1:27017/listings";
let datainput=require("./data.js");
let newListings=require("../models/listings.js")
main().then(()=>{
    console.log("The database connection has setUp succesfully");
}).catch((err)=>{
   console.log("err is"+err);
})
async function main(){
    await mongoose.connect(Mongo_Url);
}

async function init(){
    await newListings.deleteMany({});
    datainput.data=datainput.data.map((ele)=>({...ele,owner:"6817a9320d9b7a2639642b64"}));
    let data=await newListings.insertMany(datainput.data);
    console.log("the data is inserted successfulloy");
};
init();