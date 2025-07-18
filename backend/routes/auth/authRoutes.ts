import express from 'express';
import {
	signUpUser,
	signInUser,
	signOutUser,
} from '../../controllers/authController';

const router = express.Router();

router.post('/signUp', signUpUser);
router.post('/signIn', signInUser);
router.post('/signOut', signOutUser);

export default router;
