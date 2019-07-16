const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/',(req,res,next) => {
    Order.find()
    .select("_id productId quantity")
    .populate('productId', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return{
                    _id: doc._id,
                    productId: doc.productId,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })  
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/',(req,res,next) => {
    Product.findById(req.body.productId)
        .then(product => {
            // if(!product){
            //     return res.status(404).json({
            //         message: 'Product was not found'
            //     })
            // }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    productId: result.productId,
                    quantity: result.quantity  
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId',(req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select("_id productId quantity")
        .populate('productId')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc){
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Order was not found'
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

router.delete('/:orderId',(req,res,next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
        .exec()
        .then(deleted => {
            if(deleted){
                res.status(200).json({
                    message: 'Deleted product was successfully',
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/orders/',
                        body: {
                            productId: 'String',
                            quantity: 'Number'
                        }
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Order was not found'
                });
            }
            console.log(deleted);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;