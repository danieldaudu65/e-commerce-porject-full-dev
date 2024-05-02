const express = require('express')
const newMemberSchema = require('../model/newMember')
const router = express.Router()
const addressBook = require('../model/AddressBool')
const jwt = require('jsonwebtoken');
require('dotenv').config()





router.post('/change-password', async (req, res) => {
    const { password, newPassword, confirmPassword } = req.body

    if (!password || !newPassword || !confirmPassword) {
        return res.status(400).send({ status: 'Please type in your password' })
    }

    try {
        const user = await newMemberSchema.findOne({ password })
        if (!user) {
            res.status(404).send({ status: 'Password Incorrect' })
        }
        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return res.status(404).send({ status: 'Password Incorrect' })
        }
``    
        const hashPassword = await bcrypt.hash(newPassword, 10)

        await newMemberSchema.findByIdAndUpdate(user._id, { password: hashPassword })
        return res.status(200).send({ status: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 'Internal Server Error' });
    }
})

  
router.post('/add-address', async (req, res) => {
    try {

        // All field needed by the user to fill
        const { fullName, phoneNumber, address, city, state } = req.body

        const newAddress = new addressBook({
            fullName,
            phoneNumber,
            address,
            city,
            state
        })
        
        // Generate a unique token for user address
        const addressToken = jwt.sign({
            _id: user._id,
            address
        }. process.env.JWT_SECRET)
    
        await newAddress.save()

        res.status(201).send({ status: 'Address Succesfully Added', address: newAddress,  addressToken })
    }
    catch (error) {
        console.error('Error occured while Adding', error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


// router.post('/edit-adressBook', async (req,res) =>{
//     try{

//     }
// })

module.exports = router