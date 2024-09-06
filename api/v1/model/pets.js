const mongoose = require('mongoose');

const petCategories = ['Dog' , 'Cat', 'Bird','Fish','Rabbit', 'Other'];

mongoose.pluralize(null);
const Pets_Schema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    category:{type:String , enum:petCategories , required:true},
    name: {type: String , trim:true , required:[true , 'DefualtPetName'] },
    weight: {type: Number  , required:[true ] },
    picUrl:{type: String , trim:true , required:[true , 'picurl'] },
    age:{type: Number , required:[true ] },
    isAdopted:{type:Boolean , default:false},
    AdopterName: {type: String , trim:true  },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'user_pets' }
});
module.exports = mongoose.model('pet',Pets_Schema);
