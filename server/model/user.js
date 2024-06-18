const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: Number,
    password: String,
    cartData: Object,
    image: String,
    Card: String,
    savedItems: [String],
    is_online: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    timeStanp: Number,
    addresses: [
        {
            name: String,
            number: Number,
            address: String,
            city: String,
            state: String
        }
    ],
}, { collection: 'user' })

module.exports = mongoose.model('User', userSchema)
