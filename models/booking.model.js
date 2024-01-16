const mongoose = require('mongoose');
const lapanganSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lokasi: {
        type: String,
    },
    harga: {
        type: Number,
    },
    kota: {
        type: String,
    },
});
// Booking Schema
const bookingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        validate: {
            validator: (val) => {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return emailRegex.test(val);
            },
            message: 'Invalid e-mail.',
        },
    },
    catatan: {
        type: String,
        required: 'This field is required.',
    },
    mobile: {
        type: String,
        required: 'This field is required.',
    },
    tanggal_booking: {
        type: Date,
        required: 'This field is required.',
    },
    waktu_pemesanan: {
        type: String,
        required: 'This field is required.',
    },
    lapangan: lapanganSchema,
});

mongoose.model('Booking', bookingSchema);