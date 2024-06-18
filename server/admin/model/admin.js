const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    is_online: {type: Boolean, default: false}
}, { collection: 'admin' })

module.exports = mongoose.model('Admin', adminSchema)