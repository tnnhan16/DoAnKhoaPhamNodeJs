import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
    Token: String,
    User: mongoose.SchemaTypes.ObjectId,
    RegisterDate: Date,
    State: Boolean
});

export default mongoose.model("Token", tokenSchema);