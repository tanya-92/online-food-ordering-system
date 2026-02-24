import asyncHandler from 'express-async-handler';
import Canteen from '../models/Canteen.js';


const addCanteen = asyncHandler(async (req, res) => {
    const { name, place, openingTime, closingTime, image } = req.body;

    const canteen = await Canteen.create({
        owner: req.user._id,
        name,
        place,
        openingTime,
        closingTime,
        image
    });

    if (canteen) {
        res.status(201).json(canteen);
    } else {
        res.status(400);
        throw new Error('Invalid canteen data');
    }
});


const getCanteens = asyncHandler(async (req, res) => {
    const canteens = await Canteen.find({});
    res.json(canteens);
});


const getMyCanteen = asyncHandler(async (req, res) => {
    const canteen = await Canteen.findOne({ owner: req.user._id });
    if (canteen) {
        res.json(canteen);
    } else {
        res.status(404);
        throw new Error('Canteen not found');
    }
});

export { addCanteen, getCanteens, getMyCanteen };
