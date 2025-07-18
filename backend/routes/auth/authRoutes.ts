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

export default router;
