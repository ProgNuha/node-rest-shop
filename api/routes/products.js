const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');

router.get('/',(req,res,next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        if(docs){
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: 'Product was empty'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/',(req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result =>{
            console.log(result);
        })
        .catch(err => console.log(err));

    res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: product
    });
});

router.get('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: 'Product was not found'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:productId',(req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(updated => {
            console.log(updated);
            res.status(200).json(updated);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
        .exec()
        .then(deleted => {
            res.status(200).json(deleted);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;