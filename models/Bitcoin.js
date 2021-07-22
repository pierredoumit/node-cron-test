const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BitcoinSchema = new Schema({
    price: { type: Number }
}, {
    timestamps: true
});

module.exports = Bitcoin = mongoose.model('bitcoins', BitcoinSchema);
