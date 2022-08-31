const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    me: {
        type: String,
    },
    customer_name: {
        type: String,
        maxlength: 50
    },
    customer_email: {
        type: String,
        trim: true,
        maxlength: 50
    },
    customer_phone: {
        type: String,
        maxlength: 50
    },
    customer_company: {
        type: String,
        maxlength: 50
    },
    date: {
        type: Date,
    },
    deal_content: {
        type: String,
    }
    })



const Customer = mongoose.model('Customer', customerSchema)

module.exports = { Customer }