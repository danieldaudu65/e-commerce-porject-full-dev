const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    id:{
        type: Number,
    },
    name: {
        type: String,
    },
    description: { type: String },
    image: {
        type: String,
    },   
    newproductPrice: {
        type: Number,
    },
    oldproductPrice: {
        type: Number,
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