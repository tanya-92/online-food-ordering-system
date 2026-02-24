import asyncHandler from 'express-async-handler';
import Item from '../models/Item.js';
import Canteen from '../models/Canteen.js';


const addItem = asyncHandler(async (req, res) => {
    const { canteenId, name, price, category, image } = req.body;

    const canteen = await Canteen.findOne({ _id: canteenId, owner: req.user._id });
    if (!canteen) {
        res.status(401);
        throw new Error('Not authorized to add items to this canteen');
    }

    const item = await Item.create({
        canteen: canteenId,
        name,
        price,
        category,
        image
    });

    if (item) {
        res.status(201).json(item);
    } else {
        res.status(400);
        throw new Error('Invalid item data');
    }
});


const getItemsByCanteen = asyncHandler(async (req, res) => {
    const items = await Item.find({ canteen: req.params.canteenId });
    res.json(items);
});


const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        const canteen = await Canteen.findOne({ _id: item.canteen, owner: req.user._id });
        if (!canteen) {
            res.status(401);
            throw new Error('Not authorized');
        }

        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});


const updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (item) {
        const canteen = await Canteen.findOne({ _id: item.canteen, owner: req.user._id });
        if (!canteen) {
            res.status(401);
            throw new Error('Not authorized');
        }

        item.available = req.body.available !== undefined ? req.body.available : item.available;

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find({});
    res.json(items);
});

export { addItem, getItemsByCanteen, deleteItem, updateItem, getAllItems };
