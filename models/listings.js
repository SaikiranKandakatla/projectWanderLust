let mongoose=require("mongoose");
let Schema=mongoose.Schema;
let review=require("./review.js")
let newSchema=new Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true,
            max:[100,"maxlength must be 100"]
        },
        image:{
            type:String,
            default:"https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v)=>v===""? "https://plus.unsplash.com/premium_photo-1682377521753-58d1fd9fa5ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
        },
        price:{
            type:Number
        },
        location:{
            type:String,
            min:[4,"min length must be 4"],
            max:[50,"maxlength must be 50"]
        },
        country:{
            type:String,
            min:[4,"min length must be 4"],
            max:[50,"maxlength must be 50"]
        },
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"review"
            }
        ]
            
        
    }
);

newSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}})
    }
})
let newListing=mongoose.model("newListing",newSchema);
module.exports=newListing;