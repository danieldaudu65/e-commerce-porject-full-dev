const mongoose = require('mongoose')



const orderSchema = new mongoose.Schema({
    username:
        { type: String },
    
    orderItems: [String],
    totalPrice: { type: Number },

})

module.exports = mongoose.model('orders' , orderSchema)

