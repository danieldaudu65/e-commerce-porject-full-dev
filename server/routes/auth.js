const express = require('express');
const authrouter = express.Router();
const newMemberSchema2 = require('../model/newMember');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../util/nodemailer');
require('dotenv').config()
 

//  end point for user to sign-in schema

authrouter.post('/signup', async (req, res) => {
    try {
        const { email, password, phoneNumber, fullName } = req.body;

        // Check if any required field is missing
        if (!email || !password || !phoneNumber || !fullName) {
            return res.status(400).send({ status: 'Please fill in all required fields' });
        }

        // Check if the user email already exists
        const existingUser = await newMemberSchema2.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ status: 'User email already exists' });
        }

        // Hashing the user password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a cart object for the user
        const cart = {};
        for (let i = 0; i < 30; i++) {
            cart[i] = 0;
        }

        // Create a new user document
        const newUser = new newMemberSchema2({
            email,
            password: hashedPassword,
            phoneNumber,
            fullName,
            cartData: cart,
            userId: uuidv4()
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token

        // Send success response with token and user details
        res.status(200).send({
            status: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send({ status: 'Internal Server Error' });
    }
});



// end point for login in user account
authrouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // CHeck if the username or password filed are empty 
    if (!email || !password) {
        return res.status(400).send({ status: 'Please fill in all required fields' });
    }

    try {
        // Check if the user exists based on email
        const user = await newMemberSchema2.findOne({ email });

        // if user not found, return error
        if (!user) {
            return res.status(400).send({ status: 'User not found' });
        }

        // to compare the password passed by the user vs the password in the database
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(401).send({ status: 'Incorrect details' });
        }
        //  if password not same after bcrytping it return Incorrect password
        // generate jwt token
        const token = jwt.sign({
            _id: user._id,
        }, process.env.JWT_SECRET);


        user.is_online = true;
        await user.save();


        res.status(200).send({ status: 'Login successful', user, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'Internal Server Error' });
    }
});


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM5M2FhNTEwOGQyNzUwMGViNTVjZmIiLCJlbWFpbCI6InNwZW5jZXJvZ2JlNDE5QGdtYWlsLmNvbSIsImlhdCI6MTcxNTAyNjYxMH0.a4nZCTr9CuYgcbTImwSs1n1_RbO4aPDECcHMiTx9Olw







// //  To reset Password
// router.post('/reset-password', async (req,res) =>{
//     const { email, otp } = req.body

//     // check if the email field isnt empty
//     if (!email) {
//         return res.status(400).send({status: "PLease fill in Your email"})
//     }

//     try {

//         sendOTP(email,otp)
//         // try if user email exist in the database
//         const user = await newMemberSchema.findOne({email});

//         if (!user) {
//             return res.status(404).send({status: "User not existing PLease Sign in"})
//         }
//     }
//     catch{

//     }
// })


authrouter.post('/logout', async (req, res) => {
    const { token } = req.body; // Destructuring the request body

    // Checking if any required field is missing
    if (!token) {
        return res.status(400).send({ 'status': 'Error', 'msg': 'all fields must be filled' });
    }

    try {
        // token authentication
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // update user document online status
        await User.updateOne({ _id: user._id }, { is_online: false });

        res.status(200).send({ 'status': 'success', 'msg': 'success' });
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).send({ status: 'error', msg: 'Token verification failed' });
        }
        // Sending error response if something goes wrong
        res.status(500).send({ "status": "some error occurred", "msg": error.message });
    }
});
module.exports = authrouter;
