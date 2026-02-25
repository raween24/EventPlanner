import mongoose from "mongoose";

const dispoSchema=new mongoose.Schema({
    date_deb:{type:Date},
    date_fin:{type:Date},
    satut_disp:{type:Boolean}}
)

export default mongoose.model("Dispo", dispoSchema);
