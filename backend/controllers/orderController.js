import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Item from '../models/Item.js';
import Canteen from '../models/Canteen.js';

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

        const validatedItems = [];
        let totalPrice = 0;

        for (const itemInput of canteenItems) {
            const itemId = itemInput._id || itemInput.item || itemInput.id;
            const dbItem = await Item.findById(itemId);

            if (!dbItem) {
                res.status(404);
                throw new Error(`Item ${itemInput.name || 'Unknown'} not found in database`);
            }

            validatedItems.push({
                name: dbItem.name,
                quantity: itemInput.quantity,
                price: dbItem.price,
                image: dbItem.image,
                item: dbItem._id
            });
            totalPrice += dbItem.price * itemInput.quantity;
        }

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
            items: validatedItems,
            totalPrice,
            token: tokenNumber,
            orderStatus: 'Preparing',
            paymentStatus: 'Pending'
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

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        const canteen = await Canteen.findById(order.canteen);
        if (!canteen || canteen.owner.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this order');
        }

        order.orderStatus = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        const canteen = await Canteen.findById(order.canteen);
        if (!canteen || canteen.owner.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to update this order');
        }

        order.paymentStatus = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


const deleteAllOrders = asyncHandler(async (req, res) => {
    const { canteenId } = req.params;

    console.log("DELETE ALL HIT");
    console.log("Canteen:", canteenId);

    const canteen = await Canteen.findById(canteenId);
    if (!canteen || canteen.owner.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to delete these orders');
    }

    await Order.deleteMany({ canteen: canteenId });

    res.status(200).json({
        success: true,
        message: "All orders deleted successfully"
    });
});

export { placeOrder, getMyOrders, getCanteenOrders, updateOrderStatus, updatePaymentStatus, deleteAllOrders };
