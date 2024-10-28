import mongoose,{Schema, Types} from "mongoose";

const postSchema =new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    image:{
        type:String,  //image url
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }]
}) 

const Post = mongoose.model("Post", postSchema);
export default Post