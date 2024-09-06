const express = require('express');
const router = express.Router();
const middleWareJwt = require('../../middleware'); 
const { getAllCategories ,getPetById ,getAllPets ,getPetsByCategory, createPet , deletePet} = require('../controller/pets');
// routes without auth
router.get('/all',getAllPets);
router.get('/all_c',getAllCategories);
router.get('/all/:category',getPetsByCategory);
router.get('/:petId',getPetById);
// set auth:
router.use(middleWareJwt);
//routes with auth: 
router.post('/create',createPet);
router.delete('/delete/:petId',deletePet);
module.exports = router;