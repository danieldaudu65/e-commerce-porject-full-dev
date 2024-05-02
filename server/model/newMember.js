const mongoose = require('mongoose')

const newMemberScheema2 = new mongoose.Schema({
    fullName: String,
    email: {
        type: String,
        unique: true
    },
    phoneNumber: Number,
    password: String,
    cartData : Object,
    is_online: {type: Boolean ,defailt: true},
    orders: {type: Number, default: 0}
}, {collection: 'user'})

module.exports = mongoose.model('newmembership' , newMemberScheema2)