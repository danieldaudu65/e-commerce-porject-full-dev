const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: { type: String },
    image: {
        type: String,
        required: true
    },   
    newproductPrice: {
        type: Number,
        required: true
    },
    oldproductPrice: {
        type: Number,
        required: true
    },
    date: {
        type:Date,
        default : Date.now
    },
    is_available: {type: Boolean, default: true},
    rating: { type: Number },
    reviews: {
        username: { type: String },
        rating: { type: Number },
        comments: { type: String }
    },
    colors: [String],
    sizes: [Number],
})

module.exports = mongoose.model('products', productSchema)