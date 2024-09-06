const mongoose = require('mongoose');
const Users_model = require('../model/user');
const Pets_model = require('../model/pets');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../send_email');

const generateResetToken = async (user) => {
    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return token;
}

module.exports = {

    registerUser: async (req, res) => {
        const { Email, UserName, PhoneNumber, UserPassword } = req.body;
        try {
            const existUser = await Users_model.findOne({ Email });
            if (existUser) {
                return res.status(401).json("Email User All ready Exist.");
            }
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(UserPassword, salt);
            const newUser = new Users_model({
                _id: new mongoose.Types.ObjectId(),
                Email, UserName, PhoneNumber, UserPassword: hashedPassword,PetsArray:[]
            });
            const result = await newUser.save();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: `server error occurred while register: ${error.message}` });
        }
    },
   
    loginUser: async (req, res) => {
        const { Email , UserPassword} = req.body;
        console.log(Email , UserPassword);
        
        try {
            const foundUser = await Users_model.findOne({ Email });
            if (!foundUser) {
                return res.status(403).json({ message: "User not Found" });
            }
            const passwordMatch = await bcrypt.compare(UserPassword, foundUser.UserPassword);
            if (passwordMatch) {
                const accessToken = jwt.sign(foundUser.UserName, process.env.ACCESS_TOKEN_SECRET);
                return res.status(200).json({ message: "Login successfull", accessToken, foundUser });
            } else {
                return res.status(401).json({ message: "Invalid credntials" });
            }
        } catch (err) {
            return res.status(500).json({ error: ` ${err.message}` });
        }
    },

    getPetsUser: async (req, res) => {
        try {
            const userId = req.params.userId;
            const CurrentUser = await Users_model.findById(userId);
            if (CurrentUser != null) {
                const PetsArrayIds = CurrentUser.PetsArray;
                const pets = await Pets_model.find({ _id: { $in: PetsArrayIds } });
                return res.status(200).json(pets);
            } else {
                return res.status(404).json("User Not Found");
            }
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }

    },

    updateUser: async(req,res)=>{
        try{
            const userId = req.params.userId;
            const updateData = req.body;
            if(updateData.UserPassword){
                const salt = await bcrypt.genSalt(12);
                updateData.UserPassword = await bcrypt.hash(updateData.UserPassword, salt);
            }
            const updatedUser = await Users_model.findByIdAndUpdate(userId , updateData ,{new:true});
            if(!updatedUser){
                return res.status(404).json({massage:"User not found"});
            }
            return res.status(200).json(updatedUser);
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }

    },
            
    deleteUser: async(req,res)=>{
        try{
            const userId = req.params.userId;
            const deletedUser = await Users_model.findByIdAndDelete(userId);
            if(!deletedUser){
                return res.status(404).json({massage:"User not found"});
            }
            return res.status(200).json({massage:"User Successfully deleted"});

        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        } 
    },
 
    getUserDetails:async (req,res)=>{
        try{
            const userId = req.params.userId;
            const user = await Users_model.findById(userId);
            if(!user){
                return res.status(403).json({massage:"User not found"});
            }
            return res.status(200).json(user);
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }

    },

    resetPassword: async(req,res)=>{
        try{
            const {email} = req.body;
            const user = await Users_model.findOne({Email:email});
            if(!user){
                return res.status(403).json({massage:"User not found"});
            }

            const token = await generateResetToken(user);
            const currentDomain = req.protocol + `://` + req.get('host');
            const resetLink = `${currentDomain}/resetpass?userid=${user._id}&token=${token}`;
            const emailContent = `
            <h6> You have Requested to reset your password Please click the link below to reset your password.</h6>
            <a href="${resetLink}"> Reset Password </a><p> <i> Note:This link is valid only for 1 Hour!!! </i> </p>`;
            await sendEmail.SendEmail(email , "Password Reset", emailContent);

        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }
    },
        
    passwordResetVerified: async (req,res)=>{
        try{
            const {userId , token } = req.params;
            const {newPassword} = req.body;
            const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            if(!decodedToken || decodedToken.userId !== userId){
                return res.status(401).json({massage:"Inavlid or expired Token "});
            }
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(newPassword,salt);
            const updatedUser = await Users_model.findByIdAndUpdate(userId, {UserPassword:hashedPassword},{new:true});
            if(!updatedUser){
                return res.status(404).json({massage:"User not found"});
            }

            return res.status(200).json({massage:"Password updated successfully "});
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }
    },
   
    searchUsers:async (req,res)=>{
        const {query} = req.body;
        try{
            const users = await Users_model.find({
              $or:[
                {UserName:{$regex:query,$options:'i'}},
                {email:{$regex:query,$options:'i'}},
                {PhoneNumber:{$regex:query,$options:'i'}},
              ]  
            });
            return res.status(200).json(users);
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }
    },
  
    getUserByPetId:async (req,res)=>{
        const {petId} = req.params;
        try{
            const pet = await Pets_model.findById(petId);
            if(!pet){
                return res.status(404).json({massage:"pet not found"});
            }
            const userId = pet.UserId;
            if(!userId){
                return res.status(404).json({massage:"no user associated with pet found "});
            }
            return res.status(200).json(user);
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }
    },
       
    getAllUsers: async(req,res)=>{
        try{
            const allusers = await Users_model.find();
            return res.status(200).json(allusers);
        }catch(err){
            return res.status(500).json({ error: ` ${err.massage}` });
        }
    }
};