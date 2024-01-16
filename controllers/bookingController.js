const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');


//--------------
// Function to handle breadcrumbs
function createBreadcrumb(...steps) {
    return steps.map((step, index) => ({
        text: step,
        link: `/booking/${index + 1}`
    }));
}

// Step 1: Render form with fields name and mobile
router.get('/1', (req, res) => {
    console.log(req.session); // Log the session data
    const formDataStep1 = req.session.formDataStep1 || {};
    res.render("booking/bookingStep1", {
        viewTitle: "Booking Lapangan Segera!",
        formDataStep1,
        breadcrumb: createBreadcrumb('Pilih Waktu dan Tempat')
    });
});

// Step 1: Handle form submission for fields name and mobile
router.post('/1', (req, res) => {
    // Initialize formDataStep1 or use existing data if available
    req.session.formDataStep1 = req.session.formDataStep1 || {};
    
    // Process form data for Step 1 and store it in session
    req.session.formDataStep1.tanggal_booking = req.body.tanggal_booking;
    req.session.formDataStep1.waktu_pemesanan = req.body.waktu_pemesanan;
    req.session.formDataStep1.lapangan = {
        name: req.body.lapanganName,
        lokasi: req.body.lapanganLokasi,
        harga: req.body.lapanganHarga,
        kota: req.body.lapanganKota,
    };
    // Redirect to Step 2
    res.redirect('/booking/2');
});

// Step 2: Render form with fields city and email
router.get('/2', (req, res) => {
    console.log(req.session); // Log the session data
    const formDataStep1 = req.session.formDataStep1 || {};
    res.render("booking/bookingStep2", {
        viewTitle: "Insert Booking - Step 2",
        formDataStep1,
        breadcrumb: createBreadcrumb('Pilih Waktu dan Tempat', 'Informasi Pesanan')
    });
});

// Step 2: Handle form submission for fields city and email
router.post('/2', (req, res) => {
    // Combine data from both steps
    
    const formDataStep1 = req.session.formDataStep1 || {};
    const formDataStep2 = req.body;
    console.log(formDataStep2); // Log the session data

    const combinedFormData = Object.assign({}, formDataStep1, formDataStep2);
    console.log(combinedFormData); // Log the session data


    // Save booking record
    const booking = new Booking(combinedFormData);
    booking.save((err, doc) => {
        if (!err) {
            // Clear form data from session
            delete req.session.formDataStep1;
            res.redirect('/booking/list');
        } else {
            // Handle validation errors
            if (err.name == 'ValidationError') {
                res.render("booking/bookingStep2", {
                    viewTitle: "Insert Booking - Step 2",
                    formDataStep1,
                    booking: req.body,
                    breadcrumb: createBreadcrumb('Step 1', 'Step 2')
                });
            } else {
                console.log('Error during record insertion : ' + err);
            }
        }
    });
});



//-------------
router.get('/step1', (req, res) => {
    res.render("booking/booking_one", {
        //viewTitle: "Insert Booking"
    });
});

router.get('/step2', (req, res) => {
    res.render("booking/booking_two", {
        //viewTitle: "Insert Booking"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});

router.get('/form', (req, res) => {
    res.render("booking/addOrEdit", {
        //viewTitle: "Insert Booking"
    });
});


function insertRecord(req, res) {
    var booking = new Booking();
    
    booking.fullName = req.body.fullName;
    booking.email = req.body.email;
    booking.mobile = req.body.mobile;
    booking.tanggal_booking = req.body.tanggal_booking;
    // Assign lapangan information as a subdocument
    booking.lapangan = {
        name: req.body.lapanganName,
        lokasi: req.body.lapanganLokasi,
        harga: req.body.lapanganHarga,
        kota: req.body.lapanganKota,
    };
    
    
    booking.save((err, doc) => {
        console.log(err);
        if (!err)
            res.redirect('booking/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("booking/addOrEdit", {
                    viewTitle: "Insert Booking",
                    booking: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}


function updateRecord(req, res) {
    Booking.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('booking/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("booking/addOrEdit", {
                    viewTitle: 'Update Booking',
                    booking: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
    Booking.find((err, docs) => {
        if (!err) {
            res.render("booking/list", {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving booking list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
    Booking.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("booking/addOrEdit", {
                viewTitle: "Update Booking",
                booking: doc
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
    Booking.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/booking/list');
        }
        else { console.log('Error in booking delete :' + err); }
    });
});

module.exports = router;