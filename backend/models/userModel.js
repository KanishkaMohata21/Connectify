import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }
    ],
    profileimg:{
        data: { type: String, required: true }, // Change type to String
        contentType: { type: String, required: true },
    },
    coverimg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    }
},{timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;
