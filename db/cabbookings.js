let mongoose = require('mongoose');
let CabBookingsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    cabDriverId: { type: Number },
    cabRegiNo: { type: String },
    cabDriverMobileNo: { type: Number },
    startLocation: {
        lat: { type: Number },
        long: { type: Number },
        timeStamp: { type: Number },
        index: false
    },
    stopLocation: {
        lat: { type: Number },
        long: { type: Number },
        timeStamp: { type: Number },
        index: false
    },
    consumerId: { type: Number },
    bookingId: { type: String },
    paymentInfo: {
        noOfKms: { type: Number },
        duration: { type: Number },
        baseFare: { type: Number },
        finalamount: { type: Number },
        paymentStatus: { type: Number },
        index: false
    },
}, { versionKey: false });

let CabBookings = mongoose.model('CabBookings', CabBookingsSchema, 'CabBookings');
module.exports = CabBookings;