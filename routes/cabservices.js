const CabTrackings = require('../db/cabtracking');
const CabBookings = require('../db/cabbookings');
const mongoose = require("mongoose");
const cabStatus = require('../constants/cabstatus');
const paymentStatus = require('../constants/paymentStatus');

exports.getListOfCarsNearBy = function (reqBody, res) {
    console.log(reqBody)
    const { lat, long } = reqBody || {};
    console.log(lat, long)
    CabTrackings.aggregate([
        { $match: { rideStatus: cabStatus.AVAILABLE } },
        {
            $project: {
                cabDriverId: 1,
                cabRegiNo: 1,
                cabDriverMobileNo: 1,
                baseFare: 1,
                cabType: 1,
                location: 1,
                distance: {
                    $sqrt: {
                        $add: [
                            { $pow: [{ $subtract: ["$location.lat", +lat] }, 2] },
                            { $pow: [{ $subtract: ["$location.long", +long] }, 2] }
                        ]
                    }
                }
            }
        },
        { $sort: { distance: 1 } },
        { $limit: 15 }
    ], (err, cabs) => {
        if (err) {
            console.log(err);
            res.status(502).send([]);
            return;
        }
        res.status(200).send(cabs || []);
    })
}
exports.bookNearByCab = function (reqBody, res) {
    console.log("reqBody", reqBody)
    const { cab, consumer } = reqBody;
    const { cabRegiNo } = cab;
    CabTrackings.update(
        { "cabRegiNo": cabRegiNo },
        { $set: { 'rideStatus': cabStatus.OCCUPIED } },
        { multi: true }, (err, raw) => {
            if (err) console.log(err)
            if (raw) console.log(raw)
        }
    );
    let booking = new CabBookings({
        _id: new mongoose.Types.ObjectId(),
        ...cab,
        startLocation: consumer.location,
        consumerId: consumer.consumerId,
        bookingId: `${consumer.consumerId}_${new Date().getTime()}_${cab.cabRegiNo}`,
        paymentInfo: {
            baseFare: cab.baseFare,
            paymentStatus: paymentStatus.NOT_PAID,
        }
    });
    console.log(booking);
    booking.save();
    res.status(200).send(booking);
}

exports.endRide = function (reqBody, res) {
    const { cab, consumer, booking } = reqBody;
    const { cabRegiNo } = cab;
    let updatedBooking = {
        ...booking,
        stopLocation: consumer.location,
        paymentInfo: {
            noOfKms: Math.pow(
                Math.pow(booking.startLocation.lat - consumer.location.lat, 2) +
                Math.pow(booking.startLocation.long - consumer.location.long, 2)
                , 1 / 2) * 1000,
            duration: consumer.location.timeStamp - booking.startLocation.timeStamp,
            baseFare: cab.baseFare,
            paymentStatus: paymentStatus.NOT_PAID,
        }
    };
    updatedBooking.paymentInfo.finalamount = +(
        (+updatedBooking.paymentInfo.noOfKms * 2) +
        (+updatedBooking.paymentInfo.duration * 1) +
        updatedBooking.paymentInfo.baseFare
    );
    console.log("updatedBooking", updatedBooking)
    CabBookings.update(
        { bookingId: booking.bookingId },
        {
            $set: { ...updatedBooking }
        },
        { multi: true }, (err, raw) => {
            if (err) console.log(err)
            if (raw) console.log(raw)
        }
    );
    CabTrackings.update(
        { cabRegiNo: cabRegiNo },
        { $set: { 'rideStatus': cabStatus.AVAILABLE } },
        { multi: true }, (err, raw) => {
            if (err) console.log(err)
            if (raw) console.log(raw)
        }
    );
    res.status(200).send(updatedBooking || {});
}