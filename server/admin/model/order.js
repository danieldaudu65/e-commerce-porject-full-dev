const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'delivered', 'canceled'],
        default: 'pending'
    },
    date: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
