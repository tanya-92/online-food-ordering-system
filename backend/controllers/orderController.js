import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

const placeOrder = asyncHandler(async (req, res) => {
    const { items } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    }


    const ordersByCanteen = {};

    items.forEach(item => {
        const canteenId = item.canteen; 
        if (!ordersByCanteen[canteenId]) {
            ordersByCanteen[canteenId] = [];
        }
        ordersByCanteen[canteenId].push(item);
    });

    const createdOrders = [];

    //  Process each canteen's order separately
    for (const canteenId of Object.keys(ordersByCanteen)) {
        const canteenItems = ordersByCanteen[canteenId];

        
        const totalPrice = canteenItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // Find last order for this canteen created TODAY
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const lastOrder = await Order.findOne({
            canteen: canteenId,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ createdAt: -1 });

        let tokenNumber = 1;
        if (lastOrder) {
            tokenNumber = lastOrder.token + 1;
        }

        //  Create Order
        const order = new Order({
            user: req.user._id,
            canteen: canteenId,
            items: canteenItems.map(i => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                image: i.image,
                item: i._id
            })),
            totalPrice,
            token: tokenNumber,
            status: 'Paid'
        });

        const savedOrder = await order.save();
        createdOrders.push(savedOrder);
    }

    res.status(201).json({
        success: true,
        message: 'Orders placed successfully',
        orders: createdOrders,
        token: createdOrders.map(o => o.token).join(', ')
    });
});


const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

const getCanteenOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ canteen: req.params.canteenId }).sort({ createdAt: -1 });
    res.json(orders);
});

export { placeOrder, getMyOrders, getCanteenOrders };
