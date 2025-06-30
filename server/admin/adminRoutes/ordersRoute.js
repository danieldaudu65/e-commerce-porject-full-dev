const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../model/order');
const OrderItem = require('../model/orderItems');
const User = require('../../model/user');
const jwt = require('jsonwebtoken');

// Endpoint to get all orders
router.get('/get-all-orders', async (req, res) => {
    try {
        // get all orders in the database
        const all_orders = await Order.find({}).populate('user', 'fullName').populate({
            // get only the orderItem in respect to tonly the nameof the product
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name'
            }
        }).sort('date');

        // Chekc if there is no order in the database

        if (all_orders.length === 0) {
            return res.status(400).send({ status: 'fail', msg: 'No Order has been placed' });
        }
        res.status(200).send({ status: true, msg: `There are ${all_orders.length} orders available`, all_orders });
    }
    // cathing our error
    catch (error) {
        console.log('Error fetching orders', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to get one order by the user
router.get('/get-one-order', async (req, res) => {

    const token = req.header('auth-token')
    try {

        if (!token) {
            return res.status(400).send({ status: 'Fail', msg: 'Please authenticate with a valid Token' });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        // check if user doent exist in the database

        if (!user) {
            return res.status(400).send({ status: 'Fail', msg: 'User not found' });
        }

        //  Get the user order by the token provides

        const order = await Order.findOne({ user: user._id }).populate('user', 'fullName').populate({
            path: 'orderItems',
            populate: {
                path: 'product',
                select: 'name'
            }
        }).sort('date');

        if (!order) {
            return res.status(400).send({ status: 'fail', msg: 'No Order has been placed by the user' });
        }
        res.status(200).send({ status: true, msg: ` orders available`, order });
    } catch (error) {
        console.log('Error fetching orders', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to create a orfer
router.post('/create-order', async (req, res) => {
    const token = req.headers['auth-token'];
    const { orderItems } = req.body;

    try {
        if (!orderItems || !token) {
            return res.status(400).send({ status: 'Fail', msg: 'orderItems must be an array' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(400).send({ status: 'Fail', msg: 'User does not exist in the database' });
        }

        const orderItemsId = [];
        let totalAmount = 0;

        for (let item of orderItems) {
            if (!item.product) {
                return res.status(400).send({ status: 'Fail', msg: `Invalid product ID: ${item.product}` });
            }
            const newOrderItem = new OrderItem({
                product: item.product,
                quantity: item.quantity
            });

            const savedOrderItem = await newOrderItem.save();
            orderItemsId.push(savedOrderItem._id);

            totalAmount += item.productPrice * item.quantity;
        }

        const order = new Order();
        order.orderItems = orderItemsId,
        order.user = user._id,
        order.totalAmount = totalAmount,
        order.status = 'pending'

        const savedOrder = await order.save();

        if (!savedOrder) {
            return res.status(400).send('The order was not placed');
        }

        res.status(200).send(savedOrder);
    } catch (error) {
        console.error('Error creating order', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Endpoint to update a order
router.put('/update-order', async (req, res) => {
    const token = req.header('auth-token')

    try {
        // check if token is correct

        if (!token) {
            return res.status(400).send({ status: 'Fail', msg: 'Please authenticate with a valid Token' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id)
        // check if user doent exist in the database

        if (!user) {
            return res.status(400).send({ status: 'Fail', msg: 'User not found' });
        }

        // update the order with the user id 

        const order = await Order.findOneAndUpdate(
            { user: user._id },
            { status: 'delivered' },
            { new: true }
        );

        // If no order is found
        if (!order) {
            return res.status(400).send({ status: 'Fail', msg: 'Order not found for this user' });
        }
        res.status(200).send(order);

    } catch (error) {
        console.error('Error creating order', error);
        res.status(500).send({ error: 'Internal server error' });
    }
})

// Endpoint to delete a order
router.delete('/delete-order', async (req, res) => {
    const token = req.header('auth-token');
    const { orderId } = req.body;

    // Check if token is valid
    if (!token) {
        return res.status(400).send('Please provide a valid token');
    }

    try {
        // Token verification
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by id
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find the order by id and user id
        const order = await Order.findOne({ _id: orderId, user: user._id });
        if (!order) {
            return res.status(404).send('Order not found for this user');
        }

        // Delete the order
        await Order.findByIdAndDelete(orderId);

        return res.status(200).send({ status: 'success', msg: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).send('An error occurred');
    }
});

// Endpoint to get total sales
router.get('/get-total-sale', async (req, res) => {
    try {
        // Calculate total sales in the database
        const totalSales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalsales: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Check if there is no sales at all
        if (totalSales.length === 0) {
            return res.status(400).send({ status: false, msg: 'No sales available in the database' });
        }

        res.status(200).send({ status: true, totalSales: totalSales.pop().totalsales});
    } catch (error) {
        console.error('Error fetching total sales', error);
        res.status(500).send({ status: false, msg: 'Internal server error' });
    }
});

// End point to get total order count 
router.get('/get-total-order-count', async (req,res) =>{

    // Count the orders in document in our order Schema 
    const orderCount = await Order.countDocuments()

    // If there is no Order Document
    if(!orderCount){
        return res.status(400).send("No Order in Shop")
    }
    res.status(200).send({status: true, Order: `There are ${orderCount} in the data base`})

})


module.exports = router;
 