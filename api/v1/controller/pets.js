const mongoose = require('mongoose');
const Users_model = require('../model/user');
const Pets_model = require('../model/pets');

const petCategories = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Other'];

module.exports = {
    createPet: async (req, res) => {
        const { category, name, weight, picUrl, age, userId } = req.body;
        try {
            
            // Create new pet
            const pet = new Pets_model({
                _id: new mongoose.Types.ObjectId(),
                category,
                name,
                weight,
                picUrl,
                age,
                UserId:userId
            });
            await pet.save();
    
            // Find the user and update their PetsArray
            const user = await Users_model.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.PetsArray.push(pet._id);
            await user.save();
            console.log('User updated:', user); // Log updated user
    
            return res.status(200).json({ pet, user });
        } catch (err) {
            console.error('Error creating pet:', err); // Log error
            return res.status(500).json({ message: `Error Creating pet: ${err.message}` });
        }
    },
    getAllPets: async (req, res) => {
        try {
            const result = await Pets_model.find();
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json(`${err.message}`);
        }
    },
    getAllCategories: async (req, res) => {
        try {
            return res.status(200).json(petCategories);
        } catch (err) {
            return res.status(500).json(`${err.message}`);
        }
    },
    getPetsByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            if (!petCategories.includes(category)) {
                return res.status(403).json("Invalid Pet Category");
            }
            const pets = await Pets_model.find({ category });
            return res.status(200).json(pets);
        } catch (err) {
            return res.status(500).json(`${err.message}`);
        }
    },
    deletePet: async (req, res) => {
        const { petId } = req.params;
        try {
            const deletedPet = await Pets_model.findByIdAndDelete(petId);
            if (!deletedPet) {
                return res.status(404).json("Pet Not Found");
            }
            return res.status(200).json("Pet deleted successfully");
        } catch (err) {
            return res.status(500).json(`${err.message}`);
        }
    },


    //////////////////////

    getPetById: async (req, res) => {
        const { petId } = req.params;
        try {
            const pet = await Pets_model.findById(petId);
            if (!pet) {
                return res.status(404).json("Pet Not Found");
            }
            return res.status(200).json(pet);
        } catch (err) {
            return res.status(500).json(`${err.message}`);
        }
    }

};
