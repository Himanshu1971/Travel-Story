import mongoose from "mongoose";
const schema = mongoose.Schema;

const  userschema = new schema({
    fullname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    createdOn:{type:Date, default:Date.now},
});

export default mongoose.model("User",userschema);