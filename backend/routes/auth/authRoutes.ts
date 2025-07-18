import express from 'express';
import type { Request, Response } from 'express';
import {
	signUpUser,
	signInUser,
	signOutUser,
	authMiddleware,
} from '../../controllers/authController.ts';

const router = express.Router();

router.post('/signUp', signUpUser);
router.post('/signIn', signInUser);
router.post('/signOut', signOutUser);

router.get('/checkAuth', authMiddleware, (req: Request, res: Response) => {
	const user = req.user;
	res.status(200).json({
		success: true,
		message: 'Authenticated user!',
		user,
	});
});

export default router;
