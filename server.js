require('./models/db');

const express = require('express');
const Handlebars = require('handlebars');
const path = require('path');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebarsHelpers = require('./helpers/handlebars-helpers');
const bodyparser = require('body-parser');
const session = require('express-session');

const bookingController = require('./controllers/bookingController');
const homeController = require('./controllers/homeController');

var app = express();

// Middleware configurations
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static('public'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(session({
    secret: '12345', // Change this to a secret key for session management
    resave: false,
    saveUninitialized: true
}));

// View engine setup
// Register handlebars helper for breadcrumb items
app.engine(
    'hbs',
    exphbs({
        extname: 'hbs',
        defaultLayout: 'mainLayout',
        layoutsDir: path.join(__dirname, '/views/layouts/'),
        helpers: {
            breadcrumbItem(label, url, active) {
                return { label, url, active };
            },
            handlebarsHelpers,
        },
        partialsDir: [path.join(__dirname, 'views', 'partials')],
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true,
        },
    })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views/'));

// Route configurations
app.use('/booking', bookingController);
app.use('/home', homeController);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Express server started at port :', PORT);
});