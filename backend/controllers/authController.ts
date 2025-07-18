import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

// Extend Express Request interface to include 'user'
declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

const JWT_SECRET = process.env.JWT_SECRET || 'CLIENT_PRIVATE_KEY';

// Sign up
export const signUpUser = async (req: Request, res: Response) => {
	const { userName, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.json({ success: false, message: 'Email already exists!' });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = new User({ userName, email, password: hashedPassword });

		await newUser.save();

		res
			.status(200)
			.json({ success: true, message: 'User created successfully!' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Some error occurred' });
	}
};

// Sign in
export const signInUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({
				success: false,
				message: "User doesn't exist! Please sign up first.",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.json({
				success: false,
				message: 'Invalid Password! Please try again.',
			});
		}

		const token = jwt.sign(
			{
				email: user.email,
				id: user._id,
				role: user.role,
				userName: user.userName,
			},
			JWT_SECRET,
			{ expiresIn: '60m' }
		);

		res.status(200).json({
			success: true,
			message: 'User logged in successfully!',
			token,
			user: {
				email: user.email,
				role: user.role,
				id: user._id,
				userName: user.userName,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Some error occurred' });
	}
};

// Sign out
export const signOutUser = (_req: Request, res: Response) => {
	res.clearCookie('token').json({
		success: true,
		message: 'Signed out successfully!',
	});
};
