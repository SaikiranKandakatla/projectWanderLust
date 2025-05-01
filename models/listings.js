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
            default:"https://unsplash.com/photos/a-house-with-a-pool-in-the-yard-gLyBSJqGyk4",
            set:(v)=>v===""? "https://unsplash.com/photos/a-house-with-a-pool-in-the-yard-gLyBSJqGyk4":v
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