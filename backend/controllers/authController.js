import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const authUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (user.role !== role) {
            res.status(401);
            throw new Error(`This account is not registered as ${role === 'owner' ? 'canteen owner' : 'student'}`);
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('Account already exists with this email');
    }

    if (!role || (role !== 'student' && role !== 'owner')) {
        res.status(400);
        throw new Error('Invalid role selected');
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

export { authUser, registerUser };
