const { date } = require("joi");
let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let review=new Schema(
    {
        rating:{
            type:Number,
            min:1,
            max:10
        },
        comments:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now()

        }
        
    }
);

module.exports=mongoose.model("review",review);
