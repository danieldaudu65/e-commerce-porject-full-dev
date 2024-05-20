const mongoose = require('mongoose')

const newMemberScheema2 = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: Number,
    password: String,
    cartData: Object,
    image: String,
    cardDetails: String,
    is_online: { type: Boolean, defailt: true },
    orders: Object,
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

module.exports = mongoose.model('newmembership', newMemberScheema2)