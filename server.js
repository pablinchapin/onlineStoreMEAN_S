const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();

mongoose.connect(config.database, {keepAlive: 300000, connectTimeoutMS: 30000}, (err)=>{
    if(err){
        console.log('Could not connect to MongoDB');
    }else{
            console.log('Successfully connected to MongoDB');
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));
app.use(cors());

const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
//const productSearchRoutes = require('./routes/product-search');


app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
//app.use('/api/search', productSearchRoutes);

/*
app.get('/', (req, res, next)=>{
    res.json({user:'PCio'});
});
*/

app.listen(config.port, (err)=>{
    if(err){
        console.log('Error starting server');
    }else{
        console.log('Server successfully started on port 3040');
    }
});