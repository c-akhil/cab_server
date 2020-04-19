let mongoose = require('mongoose');

let CabTrackingsSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId },
    cabDriverId: { type: Number },
    cabRegiNo: { type: String, index: true },
    cabDriverMobileNo: { type: Number, index: true },
    baseFare: { type: Number },
    cabType: { type: Number },
    location: {
        lat: { type: Number },
        long: { type: Number },
        timeStamp: { type: Number },
        index: false
    },
    rideStatus: { type: Number }//0 free,1 occupied,2 blocked
}, { versionKey: false });

let CabTrackings = mongoose.model('CabTrackings', CabTrackingsSchema, 'CabTrackings');
module.exports = CabTrackings;