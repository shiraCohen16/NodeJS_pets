const mongoose = require('mongoose');
mongoose.pluralize(null);
const User_Schema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    Email: {type: String , trim:true , required:[true , 'DefualtEmail'] },
    UserName:{type: String , trim:true , required:[true , 'DefualtUser'] },
    UserPassword:{type: String , trim:true , required:[true , 'DefualtPassword'] },
    PhoneNumber:{type: String , trim:true , required:[true , 'DefualtPhone'] },
    PetsArray: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pet' }]
});
module.exports = mongoose.model('user_pets',User_Schema);