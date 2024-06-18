const port = 4000;
const express = require('express')
const app = express();
const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const cors = require('cors');
const router = require('./admin/adminRoutes/product');
const authrouter = require('./routes/auth');
const cartrouter = require('./routes/cart');
const user = require('./model/user');
require('dotenv').config()

app.use(express.json())
app.use(cors())

// Database connection with MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('MongoDB connected');
})
.catch((err) => { 
    console.error('MongoDB connection error:', err);
}); 

// Image storage engine
const storage  = multer.diskStorage({
    destination : './upload/images',  
    filename: (req,file,cb)=>{
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
   
const upload = multer({storage: storage})


// Creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post('/upload', upload.single('product'),(req,res) =>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// product api link
app.use('/routes/product', router )

// user api link
app.use('/routes/auth', authrouter)

app.use('/cart', require('./routes/cart'))
app.use('/prof', require('./routes/prof'))
app.use('/user', require('./routes/user'))

// admin api links
app.use('/orders', require('./admin/adminRoutes/ordersRoute'))
app.use('/adminauth', require('./admin/adminRoutes/auth'))

// Listen to the port
app.listen(port, (error) =>{
    if(!error){
        console.log('Server Running on port ' + port);
    }
    else{
        console.log(`Error : ${error}`);
    } 
})
