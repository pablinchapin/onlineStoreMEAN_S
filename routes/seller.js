const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({accessKeyId: "AKIAIRAKXLCQK7RGT2VQ", 
secretAccessKey: "M5WYMa8MVSCo+nNWaH/Fnmo8SJhZdefSQWEXnZfs"});
//ToDo replace values with aws bucket pc

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

var upload = multer({
    storage : multerS3({
        s3 : s3,
        bucket : 'amazonopcwebapplication',
        metadata : function(req, file, cb){
            cb(null, {fieldName : file.fieldname});
        },
        key : function(req, file, cb){
            cb(null, Date.now().toString());
        }
    })
});


router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({owner : req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if(products){
                    res.json({
                        success : true,
                        message : "Products",
                        products : products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        console.log(upload);
        console.log(req.file);

        let product = new Product();

        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();

        res.json({
            success : true,
            message : 'Successfully added the product'
        })
        
    });

router.get('/faker/test', (req, res, next) => {
    for(i = 0; i < 20; i++){
        let product = new Product();
        product.category = "5ae297d1b1fa9f4811a1bf0a";
        product.owner = "5ad653a9bb33c72256cdda7d";
        product.image = faker.image.food();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message : 'Successfully added 20 pictures'
    });
});


module.exports = router;